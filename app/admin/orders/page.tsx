import { OrderDeleteButton, OrderStatusSelect } from "@/features/admin";
import { formatDate, formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const AdminOrdersPage = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { product: true } },
    },
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
              {orders.map((o) => {
                const { id, createdAt, status, totalAmount, trackingNumber, user } = o;
                return (
                  <tr key={id} className="border-b border-[var(--border)]">
                    <td className="p-4">{formatDate(createdAt)}</td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-[var(--muted)]">{user.email}</p>
                    </td>
                    <td className="p-4">{formatPrice(totalAmount)}</td>
                    <td className="p-4">
                      <OrderStatusSelect currentStatus={status} orderId={id} />
                    </td>
                    <td className="p-4">
                      {trackingNumber ? (
                        <span className="font-mono text-xs">{trackingNumber}</span>
                      ) : (
                        <span className="text-[var(--muted)]">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <OrderDeleteButton orderId={id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">주문이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
