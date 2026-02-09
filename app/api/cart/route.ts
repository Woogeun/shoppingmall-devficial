import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { product: true },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await request.json();
  const { productId, size, quantity } = body;
  if (!productId || !size || quantity == null || quantity < 1) {
    return NextResponse.json({ error: "상품, 사이즈, 수량을 확인해주세요." }, { status: 400 });
  }

  const inv = await prisma.inventory.findFirst({
    where: { productId, size },
  });
  if (!inv || inv.quantity < quantity) {
    return NextResponse.json({ error: "재고가 부족합니다." }, { status: 400 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_size: { userId: session.id, productId, size },
    },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > inv.quantity) {
      return NextResponse.json({ error: "재고를 초과하여 담을 수 없습니다." }, { status: 400 });
    }
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId: session.id, productId, size, quantity },
    });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await request.json();
  const { cartItemId, quantity } = body;
  if (!cartItemId) return NextResponse.json({ error: "cartItemId 필요" }, { status: 400 });

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId: session.id },
  });
  if (!item) return NextResponse.json({ error: "장바구니 항목을 찾을 수 없습니다." }, { status: 404 });

  const inv = await prisma.inventory.findFirst({
    where: { productId: item.productId, size: item.size },
  });
  const maxQty = inv?.quantity ?? 0;
  const newQty = quantity == null || quantity < 1 ? 0 : Math.min(quantity, maxQty);

  if (newQty === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return NextResponse.json({ ok: true, quantity: 0 });
  }
  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQty },
  });
  return NextResponse.json({ ok: true, quantity: newQty });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get("id");
  if (!cartItemId) return NextResponse.json({ error: "id 필요" }, { status: 400 });

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: session.id },
  });
  return NextResponse.json({ ok: true });
}
