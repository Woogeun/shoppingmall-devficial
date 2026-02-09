"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/features/ui";

type OrderDeleteButtonProps = {
  orderId: string;
};

export const OrderDeleteButton = ({ orderId }: OrderDeleteButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = window.confirm(
      "이 주문을 삭제하시겠습니까? 주문 및 주문 상품 정보가 모두 삭제됩니다."
    );
    if (!ok) return;

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "주문 삭제에 실패했습니다.");
      return;
    }
    router.refresh();
  };

  return (
    <Button
      className="text-xs px-3 py-1.5"
      size="sm"
      type="button"
      variant="danger"
      onClick={handleDelete}
    >
      삭제
    </Button>
  );
};
