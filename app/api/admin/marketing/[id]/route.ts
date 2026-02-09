import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const {
    title,
    type,
    content,
    imageUrl,
    linkUrl,
    startAt,
    endAt,
    active,
    sortOrder,
  } = body;

  await prisma.marketingContent.update({
    where: { id },
    data: {
      ...(title != null && { title }),
      ...(type != null && { type }),
      ...(content != null && { content }),
      ...(imageUrl != null && { imageUrl }),
      ...(linkUrl != null && { linkUrl }),
      ...(startAt != null && { startAt: new Date(startAt) }),
      ...(endAt != null && { endAt: new Date(endAt) }),
      ...(active != null && { active }),
      ...(sortOrder != null && {
        sortOrder: parseInt(sortOrder, 10) || 0,
      }),
    },
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

  await prisma.marketingContent.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
