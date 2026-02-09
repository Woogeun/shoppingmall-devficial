import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const AdminUsersPage = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">사용자 관리</h1>
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-medium text-foreground">이름</th>
                <th className="p-4 font-medium text-foreground">이메일</th>
                <th className="p-4 font-medium text-foreground">역할</th>
                <th className="p-4 font-medium text-foreground">가입일</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)]">
                  <td className="p-4 font-medium text-foreground">{u.name}</td>
                  <td className="p-4 text-[var(--muted)]">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={
                        u.role === "ADMIN"
                          ? "rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs"
                          : "text-[var(--muted)]"
                      }
                    >
                      {u.role === "ADMIN" ? "관리자" : "회원"}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--muted)]">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">등록된 사용자가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
