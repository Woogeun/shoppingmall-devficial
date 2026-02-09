import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { logUserAction } from "@/lib/userAudit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { email, password, name, role: "CUSTOMER" },
    });

    await setSession(user.id);
    await logUserAction({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "CUSTOMER",
      },
      action: "REGISTER",
      entityType: "AUTH",
      entityId: user.id,
      meta: { email: user.email },
      request,
    });
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) {
    return NextResponse.json({ error: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
