import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth";
import type { NextRequest } from "next/server";

type EntityType = "AUTH" | "CART" | "INVENTORY" | "MARKETING" | "ORDER" | "PRODUCT";

function extractRequestContext(request?: NextRequest) {
  if (!request) return { ip: undefined as string | undefined, userAgent: undefined as string | undefined };
  const ip =
    request.headers.get("x-forwarded-for") ??
    (request as NextRequest & { ip?: string }).ip ??
    undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  return { ip, userAgent };
}

export async function logUserAction(options: {
  user?: SessionUser | null;
  userId?: string;
  action: string;
  entityType: EntityType;
  entityId?: string;
  meta?: unknown;
  request?: NextRequest;
}) {
  const { user, userId, action, entityType, entityId, meta, request } = options;
  const resolvedUserId = user?.id ?? userId;

  const { ip, userAgent } = extractRequestContext(request);

  // 서버 콘솔 로깅
  console.log("[UserAudit]", {
    time: new Date().toISOString(),
    userId: resolvedUserId,
    action,
    entityType,
    entityId,
    ip,
  });

  try {
    await prisma.userAuditLog.create({
      data: {
        userId: resolvedUserId ?? null,
        action,
        entityType,
        entityId,
        meta: meta ? JSON.stringify(meta) : null,
        ip,
        userAgent,
      },
    });
  } catch {
    // 감사 로그 실패는 비즈니스 로직을 막지 않음
  }
}

