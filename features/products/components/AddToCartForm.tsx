"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/features/ui";

type SizeOption = { quantity: number; size: string };

type AddToCartFormProps = {
  isLoggedIn: boolean;
  price: number;
  productId: string;
  productName: string;
  sizes: SizeOption[];
};

export const AddToCartForm = ({
  isLoggedIn,
  price,
  productId,
  productName,
  sizes,
}: AddToCartFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "ok" } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");

  const maxQty = size
    ? (sizes.find((s) => s.size === size)?.quantity ?? 0)
    : 0;

  const handleAddToCart = async (e: React.FormEvent) => {
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
      body: JSON.stringify({ productId, quantity, size }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setMessage({
        type: "error",
        text: data.error ?? "장바구니 담기에 실패했습니다.",
      });
      return;
    }
    setMessage({ type: "ok", text: "장바구니에 담았습니다." });
    router.refresh();
  };

  return (
    <div className="mt-8 clay-card p-6">
      <h3 className="font-semibold text-foreground mb-4">옵션 선택</h3>
      <form className="space-y-4" onSubmit={handleAddToCart}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            사이즈
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.length === 0 ? (
              <p className="text-[var(--muted)]">재고 없음</p>
            ) : (
              sizes.map((s) => (
                <button
                  key={s.size}
                  className={`rounded-xl px-4 py-2 border transition-colors ${
                    size === s.size
                      ? "bg-[var(--pastel-lavender)] border-[var(--accent)] text-foreground"
                      : "bg-[var(--surface)] border-[var(--border)] text-foreground hover:bg-[var(--pastel-peach)]"
                  }`}
                  onClick={() => setSize(s.size)}
                  type="button"
                >
                  {s.size} ({s.quantity}개)
                </button>
              ))
            )}
          </div>
        </div>
        {size && maxQty > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              수량
            </label>
            <input
              className="input-soft w-24 px-3 py-2"
              max={maxQty}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              type="number"
              value={quantity}
            />
          </div>
        )}
        {message && (
          <p
            className={
              message.type === "ok" ? "text-green-600" : "text-red-600"
            }
          >
            {message.text}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            disabled={loading || sizes.length === 0}
            type="submit"
          >
            {loading ? "처리 중..." : "장바구니 담기"}
          </Button>
          {isLoggedIn && (
            <Link href="/cart">
              <Button type="button" variant="secondary">
                장바구니 보기
              </Button>
            </Link>
          )}
          {!isLoggedIn && (
            <Link href="/login">
              <Button type="button" variant="secondary">
                로그인 후 구매하기
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};
