import { formatDateTime } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const AdminAuditPage = async () => {
  const [userLogs, adminCount] = await Promise.all([
    prisma.userAuditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">감사 로그 (사용자·관리자 행동)</h1>
      <p className="mb-4 text-sm text-[var(--muted)]">
        최근 사용자 및 관리자 행동 로그 상위 100건입니다. (관리자 수: {adminCount}명)
      </p>

      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-3 font-medium text-foreground">시간</th>
                <th className="p-3 font-medium text-foreground">사용자</th>
                <th className="p-3 font-medium text-foreground">액션</th>
                <th className="p-3 font-medium text-foreground">대상</th>
                <th className="p-3 font-medium text-foreground">IP</th>
                <th className="p-3 font-medium text-foreground">추가 정보</th>
              </tr>
            </thead>
            <tbody>
              {userLogs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--border)] align-top">
                  <td className="p-3 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td className="p-3">
                    {log.user ? (
                      <>
                        <div className="font-medium text-foreground">{log.user.name}</div>
                        <div className="text-xs text-[var(--muted)]">{log.user.email}</div>
                      </>
                    ) : (
                      <span className="text-[var(--muted)] text-xs">익명/로그인 전</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-xs bg-[var(--pastel-lavender)] rounded-full px-2 py-0.5 inline-block">
                      {log.action}
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">{log.entityType}</div>
                  </td>
                  <td className="p-3 text-xs text-[var(--muted)]">
                    {log.entityId ?? "-"}
                  </td>
                  <td className="p-3 text-xs text-[var(--muted)]">
                    {log.ip ?? "-"}
                  </td>
                  <td className="p-3 text-xs text-[var(--muted)] max-w-xs whitespace-pre-wrap">
                    {log.meta ? log.meta : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {userLogs.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">기록된 감사 로그가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditPage;

