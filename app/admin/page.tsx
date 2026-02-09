import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const AdminDashboardPage = async () => {
  const [recentOrders, lowStock] = await Promise.all([
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.inventory.findMany({
      where: { quantity: { lte: 5 } },
      include: { product: { select: { name: true } } },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">대시보드</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">최근 주문</h2>
            <Link href="/admin/orders" className="text-sm text-[var(--accent-strong)] hover:underline">
              전체보기
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-[var(--muted)] text-sm">주문 없음</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{o.user.name} · {formatPrice(o.totalAmount)}</span>
                  <span className="text-[var(--muted)]">{new Date(o.createdAt).toLocaleDateString("ko-KR")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">재고 부족 (5개 이하)</h2>
            <Link href="/admin/inventory" className="text-sm text-[var(--accent-strong)] hover:underline">
              재고 관리
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-[var(--muted)] text-sm">재고 부족 상품 없음</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((i) => (
                <li key={i.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{i.product.name} ({i.size})</span>
                  <span className="text-amber-600 font-medium">{i.quantity}개</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
