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
  const body = await request.json();
  const quantity = parseInt(body.quantity, 10);
  if (isNaN(quantity) || quantity < 0) {
    return NextResponse.json({ error: "유효한 수량을 입력해주세요." }, { status: 400 });
  }

  const updated = await prisma.inventory.update({
    where: { id },
    data: { quantity },
  });

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "ADMIN_INVENTORY_UPDATE",
    entityType: "INVENTORY",
    entityId: id,
    meta: { quantity: updated.quantity, productId: updated.productId, size: updated.size },
    request,
  });

  return NextResponse.json({ ok: true });
}
