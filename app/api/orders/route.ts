import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logUserAction } from "@/lib/userAudit";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await request.json();
  const { addressId, recipient, phone, zipCode, address1, address2 } = body;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { product: { include: { inventory: true } } },
  });
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "장바구니가 비어 있습니다." }, { status: 400 });
  }

  let shipping: { recipient: string; phone: string; zipCode: string; address1: string; address2?: string };
  if (addressId) {
    const addr = await prisma.address.findFirst({
      where: { id: addressId, userId: session.id },
    });
    if (!addr) return NextResponse.json({ error: "배송지를 찾을 수 없습니다." }, { status: 400 });
    shipping = {
      recipient: addr.recipient,
      phone: addr.phone,
      zipCode: addr.zipCode,
      address1: addr.address1,
      address2: addr.address2 ?? undefined,
    };
  } else if (recipient && phone && zipCode && address1) {
    shipping = { recipient, phone, zipCode, address1, address2 };
  } else {
    return NextResponse.json({ error: "배송 정보를 입력해주세요." }, { status: 400 });
  }

  // 재고 확인 및 차감
  for (const item of cartItems) {
    const inv = await prisma.inventory.findFirst({
      where: { productId: item.productId, size: item.size },
    });
    if (!inv || inv.quantity < item.quantity) {
      return NextResponse.json(
        { error: `${item.product.name} (${item.size}) 재고가 부족합니다.` },
        { status: 400 }
      );
    }
  }

  const totalAmount = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        userId: session.id,
        status: "PAID",
        totalAmount,
        recipient: shipping.recipient,
        phone: shipping.phone,
        zipCode: shipping.zipCode,
        address1: shipping.address1,
        address2: shipping.address2,
        paidAt: new Date(),
      },
    });

    for (const item of cartItems) {
      await tx.orderItem.create({
        data: {
          orderId: o.id,
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          priceAtOrder: item.product.price,
        },
      });
      await tx.inventory.updateMany({
        where: { productId: item.productId, size: item.size },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: session.id } });
    return o;
  });

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "PLACE_ORDER",
    entityType: "ORDER",
    entityId: order.id,
    meta: { totalAmount, itemCount: cartItems.length },
    request,
  });

  return NextResponse.json({ orderId: order.id });
}
