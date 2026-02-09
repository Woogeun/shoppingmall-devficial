"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function OrderDeleteButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  async function handleDelete() {
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
  }

  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      onClick={handleDelete}
      className="text-xs px-3 py-1.5"
    >
      삭제
    </Button>
  );
}

