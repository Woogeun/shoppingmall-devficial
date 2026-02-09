"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/features/ui";
import { formatPrice } from "@/lib/utils";

import type { Address, CartItem, Product } from "@prisma/client";

type CartItemWithProduct = CartItem & { product: Product };

type CheckoutFormProps = {
  addresses: Address[];
  cartItems: CartItemWithProduct[];
};

export const CheckoutForm = ({ addresses, cartItems }: CheckoutFormProps) => {
  const router = useRouter();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses[0]?.id ?? ""
  );
  const [useSaved, setUseSaved] = useState(addresses.length > 0);
  const [zipCode, setZipCode] = useState("");

  const total = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const shipping =
      useSaved && selectedAddressId
        ? { addressId: selectedAddressId }
        : { address1, address2, phone, recipient, zipCode };
    if (
      !useSaved &&
      (!recipient || !phone || !zipCode || !address1)
    ) {
      setError("배송 정보를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders", {
      body: JSON.stringify({ ...shipping }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "주문 처리에 실패했습니다.");
      return;
    }
    router.push(`/my/orders/${data.orderId}`);
    router.refresh();
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="clay-card p-6">
        <h2 className="font-semibold text-foreground mb-4">주문 상품</h2>
        <ul className="space-y-3">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.product.name} / {item.size} × {item.quantity}
              </span>
              <span>
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 pt-4 border-t border-[var(--border)] font-semibold flex justify-between">
          총 결제 금액 <span>{formatPrice(total)}</span>
        </p>
      </div>

      <div className="clay-card p-6">
        <h2 className="font-semibold text-foreground mb-4">배송 정보</h2>
        {addresses.length > 0 && (
          <label className="flex items-center gap-2 mb-4">
            <input
              checked={useSaved}
              className="rounded"
              type="radio"
              onChange={() => setUseSaved(true)}
            />
            저장된 배송지 사용
          </label>
        )}
        {addresses.length > 0 && useSaved && (
          <div className="space-y-2 mb-4">
            {addresses.map((a) => (
              <label
                key={a.id}
                className="flex items-start gap-2 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]"
              >
                <input
                  checked={selectedAddressId === a.id}
                  name="addressId"
                  type="radio"
                  value={a.id}
                  className="mt-1"
                  onChange={() => setSelectedAddressId(a.id)}
                />
                <div>
                  <p className="font-medium">
                    {a.recipient} · {a.phone}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {a.address1} {a.address2} ({a.zipCode})
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
        {(!useSaved || addresses.length === 0) && (
          <>
            <label className="flex items-center gap-2 mb-4">
              <input
                checked={!useSaved}
                className="rounded"
                type="radio"
                onChange={() => setUseSaved(false)}
              />
              새 배송지 입력
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="수령인"
                required={!useSaved}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <Input
                label="연락처"
                required={!useSaved}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                className="sm:col-span-2"
                label="우편번호"
                required={!useSaved}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <Input
                className="sm:col-span-2"
                label="주소"
                required={!useSaved}
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
              <Input
                className="sm:col-span-2"
                label="상세주소"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-[var(--muted)]">
        결제는 주문 완료 후 &quot;결제 완료&quot;로 처리됩니다. (데모: 실제 결제
        미연동)
      </p>

      {error && <p className="text-red-600">{error}</p>}
      <Button
        className="w-full sm:w-auto"
        disabled={loading}
        size="lg"
        type="submit"
      >
        {loading ? "처리 중..." : "주문하기"}
      </Button>
    </form>
  );
};
