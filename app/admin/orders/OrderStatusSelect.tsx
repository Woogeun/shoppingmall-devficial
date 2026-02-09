"use client";

import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABEL } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();

  async function changeStatus(status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => changeStatus(e.target.value)}
      className="input-soft px-3 py-1.5 text-sm rounded-lg min-w-[120px]"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s] ?? s}
        </option>
      ))}
    </select>
  );
}
