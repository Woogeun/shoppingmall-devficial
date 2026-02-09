import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logUserAction } from "@/lib/userAudit";

const VALID_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, trackingNumber } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "유효한 상태를 선택해주세요." }, { status: 400 });
  }

  const updateData: {
    status: (typeof VALID_STATUSES)[number];
    shippedAt?: Date;
    deliveredAt?: Date;
    trackingNumber?: string;
  } = {
    status,
  };
  if (status === "SHIPPED") {
    updateData.shippedAt = new Date();
    if (trackingNumber != null) updateData.trackingNumber = String(trackingNumber);
  }
  if (status === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
  });

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "ADMIN_ORDER_STATUS_UPDATE",
    entityType: "ORDER",
    entityId: id,
    meta: { status: order.status, trackingNumber: order.trackingNumber },
    request,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.order.delete({
    where: { id },
  });

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "ADMIN_ORDER_DELETE",
    entityType: "ORDER",
    entityId: id,
    request: _request,
  });

  return NextResponse.json({ ok: true });
}

