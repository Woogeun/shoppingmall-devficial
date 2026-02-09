import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logUserAction } from "@/lib/userAudit";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const { title, type, content, imageUrl, linkUrl, startAt, endAt, active, sortOrder } = body;

  if (!title || !type) {
    return NextResponse.json({ error: "제목과 유형을 입력해주세요." }, { status: 400 });
  }

  const mc = await prisma.marketingContent.create({
    data: {
      title,
      type,
      content: content ?? null,
      imageUrl: imageUrl ?? null,
      linkUrl: linkUrl ?? null,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      active: active !== false,
      sortOrder: parseInt(sortOrder, 10) || 0,
    },
  });

  await logUserAction({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    },
    action: "ADMIN_MARKETING_CREATE",
    entityType: "MARKETING",
    entityId: mc.id,
    meta: { title: mc.title, type: mc.type },
    request,
  });

  return NextResponse.json({ ok: true });
}
