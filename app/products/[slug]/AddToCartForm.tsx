"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type SizeOption = { size: string; quantity: number };

export function AddToCartForm({
  productId,
  productName,
  price,
  sizes,
  isLoggedIn,
}: {
  productId: string;
  productName: string;
  price: number;
  sizes: SizeOption[];
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const maxQty = size ? (sizes.find((s) => s.size === size)?.quantity ?? 0) : 0;

  async function handleAddToCart(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage({ type: "error", text: "로그인 후 장바구니에 담을 수 있습니다." });
      return;
    }
    if (!size || maxQty < 1) {
      setMessage({ type: "error", text: "사이즈를 선택해주세요." });
      return;
    }
    if (quantity < 1 || quantity > maxQty) {
      setMessage({ type: "error", text: `수량은 1~${maxQty}개까지 가능합니다.` });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, size, quantity }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "장바구니 담기에 실패했습니다." });
      return;
    }
    setMessage({ type: "ok", text: "장바구니에 담았습니다." });
    router.refresh();
  }

  return (
    <div className="mt-8 clay-card p-6">
      <h3 className="font-semibold text-foreground mb-4">옵션 선택</h3>
      <form onSubmit={handleAddToCart} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">사이즈</label>
          <div className="flex flex-wrap gap-2">
            {sizes.length === 0 ? (
              <p className="text-[var(--muted)]">재고 없음</p>
            ) : (
              sizes.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setSize(s.size)}
                  className={`rounded-xl px-4 py-2 border transition-colors ${
                    size === s.size
                      ? "bg-[var(--pastel-lavender)] border-[var(--accent)] text-foreground"
                      : "bg-[var(--surface)] border-[var(--border)] text-foreground hover:bg-[var(--pastel-peach)]"
                  }`}
                >
                  {s.size} ({s.quantity}개)
                </button>
              ))
            )}
          </div>
        </div>
        {size && maxQty > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">수량</label>
            <input
              type="number"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="input-soft w-24 px-3 py-2"
            />
          </div>
        )}
        {message && (
          <p className={message.type === "ok" ? "text-green-600" : "text-red-600"}>{message.text}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={loading || sizes.length === 0}>
            {loading ? "처리 중..." : "장바구니 담기"}
          </Button>
          {isLoggedIn && (
            <Link href="/cart">
              <Button variant="secondary" type="button">장바구니 보기</Button>
            </Link>
          )}
          {!isLoggedIn && (
            <Link href="/login">
              <Button variant="secondary" type="button">로그인 후 구매하기</Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
