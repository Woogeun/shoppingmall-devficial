import Link from "next/link";

import { Button } from "@/features/ui";
import { prisma } from "@/lib/prisma";

const TYPE_LABEL: Record<string, string> = {
  BANNER: "배너",
  NOTICE: "공지",
  PROMO: "프로모션",
};

const AdminMarketingPage = async () => {
  const list = await prisma.marketingContent.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">마케팅 콘텐츠</h1>
        <Link href="/admin/marketing/new">
          <Button>콘텐츠 추가</Button>
        </Link>
      </div>
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-medium text-foreground">유형</th>
                <th className="p-4 font-medium text-foreground">제목</th>
                <th className="p-4 font-medium text-foreground">노출순서</th>
                <th className="p-4 font-medium text-foreground">활성</th>
                <th className="p-4 font-medium text-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-b border-[var(--border)]">
                  <td className="p-4">{TYPE_LABEL[m.type] ?? m.type}</td>
                  <td className="p-4 font-medium text-foreground">{m.title}</td>
                  <td className="p-4">{m.sortOrder}</td>
                  <td className="p-4">{m.active ? "노출" : "비노출"}</td>
                  <td className="p-4">
                    <Link href={`/admin/marketing/${m.id}`} className="text-[var(--accent-strong)] hover:underline">
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">등록된 콘텐츠가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminMarketingPage;
