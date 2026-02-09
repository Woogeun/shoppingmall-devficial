import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime, ORDER_STATUS_LABEL } from "@/lib/utils";

const STEPS = [
  { key: "PAID", label: "결제 완료" },
  { key: "PREPARING", label: "상품 준비" },
  { key: "SHIPPED", label: "배송 중" },
  { key: "DELIVERED", label: "배송 완료" },
] as const;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) notFound();

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const statusOrder = ["PENDING_PAYMENT", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const currentIndex = statusOrder.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/my/orders" className="text-sm text-[var(--muted)] hover:text-foreground">
          ← 주문 목록
        </Link>
        <span
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
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

      <h1 className="text-2xl font-bold text-foreground mb-6">주문 상세</h1>

      {/* 배송 상태 단계 */}
      {order.status !== "CANCELLED" && order.status !== "PENDING_PAYMENT" && (
        <div className="clay-card p-6 mb-8">
          <h2 className="font-semibold text-foreground mb-4">배송 상태</h2>
          <div className="flex flex-wrap justify-between gap-2">
            {STEPS.map((step, i) => {
              const stepIndex = statusOrder.indexOf(step.key as typeof order.status);
              const done = currentIndex >= stepIndex;
              const isCurrent = order.status === step.key;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center flex-1 min-w-[60px] ${
                    done ? "text-foreground" : "text-[var(--muted)]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCurrent
                        ? "bg-[var(--pastel-mint)] ring-2 ring-[var(--accent)]"
                        : done
                        ? "bg-[var(--pastel-lavender)]"
                        : "bg-[var(--surface)]"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="mt-2 text-xs font-medium">{step.label}</span>
                </div>
              );
            })}
          </div>
          {order.trackingNumber && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              송장번호: <span className="font-mono text-foreground">{order.trackingNumber}</span>
            </p>
          )}
          {order.shippedAt && (
            <p className="text-sm text-[var(--muted)]">배송 시작: {formatDateTime(order.shippedAt)}</p>
          )}
          {order.deliveredAt && (
            <p className="text-sm text-[var(--muted)]">배송 완료: {formatDateTime(order.deliveredAt)}</p>
          )}
        </div>
      )}

      <div className="clay-card p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">주문 상품</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.product.name} / {item.size} × {item.quantity}
              </span>
              <span>{formatPrice(item.priceAtOrder * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 pt-4 border-t border-[var(--border)] font-semibold flex justify-between">
          총 결제 금액 <span>{formatPrice(order.totalAmount)}</span>
        </p>
      </div>

      <div className="clay-card p-6">
        <h2 className="font-semibold text-foreground mb-4">배송지</h2>
        <p className="text-foreground">{order.recipient} · {order.phone}</p>
        <p className="text-[var(--muted)] mt-1">
          ({order.zipCode}) {order.address1} {order.address2}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          주문일시: {formatDateTime(order.createdAt)}
        </p>
      </div>
    </div>
  );
}
