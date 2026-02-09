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

type OrderStatusSelectProps = {
  currentStatus: OrderStatus;
  orderId: string;
};

export const OrderStatusSelect = ({
  currentStatus,
  orderId,
}: OrderStatusSelectProps) => {
  const router = useRouter();

  const changeStatus = async (status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    if (res.ok) router.refresh();
  };

  return (
    <select
      className="input-soft px-3 py-1.5 text-sm rounded-lg min-w-[120px]"
      value={currentStatus}
      onChange={(e) => changeStatus(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s] ?? s}
        </option>
      ))}
    </select>
  );
};
