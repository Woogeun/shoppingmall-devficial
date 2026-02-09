"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function InventoryEdit({
  inventoryId,
  currentQuantity,
}: {
  inventoryId: string;
  currentQuantity: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(String(currentQuantity));
  const [loading, setLoading] = useState(false);

  async function save() {
    const n = parseInt(qty, 10);
    if (isNaN(n) || n < 0) return;
    setLoading(true);
    const res = await fetch(`/api/admin/inventory/${inventoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: n }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="input-soft w-20 px-2 py-1 text-sm"
      />
      <Button size="sm" onClick={save} disabled={loading}>
        저장
      </Button>
    </div>
  );
}
