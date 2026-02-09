import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrderDeleteButton } from "./OrderDeleteButton";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">주문 관리</h1>
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-medium text-foreground">주문일</th>
                <th className="p-4 font-medium text-foreground">주문자</th>
                <th className="p-4 font-medium text-foreground">금액</th>
                <th className="p-4 font-medium text-foreground">상태</th>
                <th className="p-4 font-medium text-foreground">송장</th>
                <th className="p-4 font-medium text-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[var(--border)]">
                  <td className="p-4">{formatDate(o.createdAt)}</td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{o.user.name}</p>
                    <p className="text-xs text-[var(--muted)]">{o.user.email}</p>
                  </td>
                  <td className="p-4">{formatPrice(o.totalAmount)}</td>
                  <td className="p-4">
                    <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                  </td>
                  <td className="p-4">
                    {o.trackingNumber ? (
                      <span className="font-mono text-xs">{o.trackingNumber}</span>
                    ) : (
                      <span className="text-[var(--muted)]">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <OrderDeleteButton orderId={o.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">주문이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
