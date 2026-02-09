"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/features/ui";

type InventoryEditProps = {
  currentQuantity: number;
  inventoryId: string;
};

export const InventoryEdit = ({
  currentQuantity,
  inventoryId,
}: InventoryEditProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(String(currentQuantity));

  const save = async () => {
    const n = parseInt(qty, 10);
    if (isNaN(n) || n < 0) return;
    setLoading(true);
    const res = await fetch(`/api/admin/inventory/${inventoryId}`, {
      body: JSON.stringify({ quantity: n }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        className="input-soft w-20 px-2 py-1 text-sm"
        min={0}
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <Button disabled={loading} size="sm" onClick={save}>
        {loading ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
};
