import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

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

  if (!name || !slug) {
    return NextResponse.json({ error: "이름과 슬러그를 입력해주세요." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description ?? null,
      price: parseInt(price, 10) || 0,
      imageUrl: imageUrl || null,
      category: category || "스니커즈",
      brand: brand || "",
      published: published !== false,
    },
  });

  if (Array.isArray(inventory) && inventory.length > 0) {
    await prisma.inventory.createMany({
      data: inventory
        .filter((i: { size: string }) => i.size?.trim())
        .map((i: { size: string; quantity: number }) => ({
          productId: product.id,
          size: i.size.trim(),
          quantity: Math.max(0, parseInt(String(i.quantity), 10) || 0),
        })),
    });
  }

  return NextResponse.json({ id: product.id });
}
