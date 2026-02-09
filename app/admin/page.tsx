import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    productCount,
    orderCount,
    totalSalesAgg,
    todaySalesAgg,
    monthSalesAgg,
    userCount,
    recentOrders,
    lowStock,
    itemsSoldAgg,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startOfToday },
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.user.count(),
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
    prisma.orderItem.aggregate({
      where: {
        order: {
          status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
        },
      },
      _sum: { quantity: true },
    }),
  ]);

  const totalSales = totalSalesAgg._sum.totalAmount ?? 0;
  const todaySales = todaySalesAgg._sum.totalAmount ?? 0;
  const monthSales = monthSalesAgg._sum.totalAmount ?? 0;
  const monthOrderCount = monthSalesAgg._count._all ?? 0;
  const itemsSold = itemsSoldAgg._sum.quantity ?? 0;
  const avgOrderValue = orderCount > 0 ? Math.round(totalSales / orderCount) : 0;
  const avgMonthOrderValue = monthOrderCount > 0 ? Math.round(monthSales / monthOrderCount) : 0;

  const stats = [
    { label: "총 매출", value: formatPrice(totalSales), href: "/admin/orders" },
    { label: "오늘 매출", value: formatPrice(todaySales), href: "/admin/orders" },
    { label: "이번 달 매출", value: formatPrice(monthSales), href: "/admin/orders" },
    { label: "평균 주문 금액", value: formatPrice(avgOrderValue), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">대시보드</h1>

      {/* 주요 매출 지표 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="clay-card floating-widget p-6 block hover:scale-[1.02] transition-transform">
            <p className="text-sm text-[var(--muted)]">{s.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* 주문/회원 개요 & 판매량 */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="clay-card p-5">
          <p className="text-sm text-[var(--muted)] mb-1">전체 주문 수</p>
          <p className="text-2xl font-bold text-foreground">{orderCount.toLocaleString()}건</p>
        </div>
        <div className="clay-card p-5">
          <p className="text-sm text-[var(--muted)] mb-1">이번 달 주문 수</p>
          <p className="text-2xl font-bold text-foreground">{monthOrderCount.toLocaleString()}건</p>
        </div>
        <div className="clay-card p-5">
          <p className="text-sm text-[var(--muted)] mb-1">누적 판매 수량</p>
          <p className="text-2xl font-bold text-foreground">{itemsSold.toLocaleString()}켤레</p>
        </div>
      </div>

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
}
