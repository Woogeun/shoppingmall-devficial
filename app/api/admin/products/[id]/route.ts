import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logUserAction } from "@/lib/userAudit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });

  const body = await request.json();
  const {
    name,
    slug,
    description,
    price,
    imageUrl,
    category,
    brand,
    published,
    inventory,
  } = body;

  if (slug && slug !== product.slug) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 400 });
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(name != null && { name }),
      ...(slug != null && { slug }),
      ...(description != null && { description }),
      ...(price != null && { price: parseInt(price, 10) || 0 }),
      ...(imageUrl != null && { imageUrl }),
      ...(category != null && { category }),
      ...(brand != null && { brand }),
      ...(published != null && { published }),
    },
  });

  if (Array.isArray(inventory)) {
    await prisma.inventory.deleteMany({ where: { productId: id } });
    if (inventory.length > 0) {
      await prisma.inventory.createMany({
        data: inventory
          .filter((i: { size: string }) => i.size?.trim())
          .map((i: { size: string; quantity: number }) => ({
            productId: id,
            size: i.size.trim(),
            quantity: Math.max(0, parseInt(String(i.quantity), 10) || 0),
          })),
      });
    }
  }

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "ADMIN_PRODUCT_UPDATE",
    entityType: "PRODUCT",
    entityId: id,
    meta: { name: updated.name, slug: updated.slug, price: updated.price },
    request,
  });

  return NextResponse.json({ ok: true });
}
