import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from "@/lib/utils";

export default async function MyOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/my/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">주문 내역</h1>
      {orders.length === 0 ? (
        <div className="clay-card p-12 text-center text-[var(--muted)]">
          주문 내역이 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/my/orders/${order.id}`}
                className="block clay-card floating-widget p-4 sm:p-6 hover:scale-[1.01] transition-transform"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      주문일 {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {order.items.length}개 상품 · {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-[var(--pastel-mint)]"
                        : order.status === "CANCELLED"
                        ? "bg-[var(--pastel-pink)]"
                        : "bg-[var(--pastel-lavender)]"
                    }`}
                  >
                    {ORDER_STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
