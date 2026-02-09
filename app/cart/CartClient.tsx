"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { CartItem, Product } from "@prisma/client";

type Item = CartItem & { product: Product };

export function CartClient({ items }: { items: Item[] }) {
  const [localItems, setLocalItems] = useState(items);
  const [updating, setUpdating] = useState<string | null>(null);

  const total = useMemo(
    () => localItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [localItems]
  );

  async function updateQty(cartItemId: string, quantity: number) {
    setUpdating(cartItemId);
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    const data = await res.json().catch(() => ({}));
    setUpdating(null);
    if (res.ok) {
      if (data.quantity === 0) {
        setLocalItems((prev) => prev.filter((i) => i.id !== cartItemId));
      } else {
        setLocalItems((prev) =>
          prev.map((i) => (i.id === cartItemId ? { ...i, quantity: data.quantity } : i))
        );
      }
      return;
    }
    alert(data.error ?? "수량 변경에 실패했습니다.");
  }

  async function remove(cartItemId: string) {
    if (!confirm("이 상품을 장바구니에서 제거할까요?")) return;
    const res = await fetch(`/api/cart?id=${cartItemId}`, { method: "DELETE" });
    if (res.ok) setLocalItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }

  if (localItems.length === 0) {
    return (
      <div className="clay-card p-12 text-center">
        <p className="text-[var(--muted)] mb-4">장바구니가 비어 있습니다.</p>
        <Link href="/products">
          <Button>상품 둘러보기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {localItems.map((item) => (
          <li key={item.id} className="clay-card p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-24 rounded-xl bg-[var(--pastel-peach)] overflow-hidden flex-shrink-0">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👟</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`} className="font-medium text-foreground hover:underline">
                {item.product.name}
              </Link>
              <p className="text-sm text-[var(--muted)]">사이즈 {item.size}</p>
              <p className="mt-1 font-medium">{formatPrice(item.product.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.quantity}
                onChange={(e) => updateQty(item.id, Number(e.target.value))}
                disabled={!!updating}
                className="input-soft w-16 px-2 py-1.5 text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(item.id)}
                className="text-red-600 hover:bg-red-50"
              >
                삭제
              </Button>
            </div>
            <div className="sm:text-right font-medium">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </li>
        ))}
      </ul>
      <div className="clay-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-lg font-semibold text-foreground">
          총 결제 금액 <span className="text-xl">{formatPrice(total)}</span>
        </p>
        <Link href="/checkout">
          <Button size="lg">주문하기</Button>
        </Link>
      </div>
    </div>
  );
}
