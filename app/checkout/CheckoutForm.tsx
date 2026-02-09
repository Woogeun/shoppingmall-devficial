"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { CartItem, Product, Address } from "@prisma/client";

type Item = CartItem & { product: Product };

export function CheckoutForm({
  cartItems,
  addresses,
}: {
  cartItems: Item[];
  addresses: Address[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useSaved, setUseSaved] = useState(addresses.length > 0);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id ?? "");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const shipping = useSaved && selectedAddressId
      ? { addressId: selectedAddressId }
      : { recipient, phone, zipCode, address1, address2 };
    if (!useSaved && (!recipient || !phone || !zipCode || !address1)) {
      setError("배송 정보를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...shipping }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "주문 처리에 실패했습니다.");
      return;
    }
    router.push(`/my/orders/${data.orderId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="clay-card p-6">
        <h2 className="font-semibold text-foreground mb-4">주문 상품</h2>
        <ul className="space-y-3">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.product.name} / {item.size} × {item.quantity}
              </span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
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
              type="radio"
              checked={useSaved}
              onChange={() => setUseSaved(true)}
              className="rounded"
            />
            저장된 배송지 사용
          </label>
        )}
        {addresses.length > 0 && useSaved && (
          <div className="space-y-2 mb-4">
            {addresses.map((a) => (
              <label key={a.id} className="flex items-start gap-2 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                <input
                  type="radio"
                  name="addressId"
                  value={a.id}
                  checked={selectedAddressId === a.id}
                  onChange={() => setSelectedAddressId(a.id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{a.recipient} · {a.phone}</p>
                  <p className="text-sm text-[var(--muted)]">{a.address1} {a.address2} ({a.zipCode})</p>
                </div>
              </label>
            ))}
          </div>
        )}
        {(!useSaved || addresses.length === 0) && (
          <>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="radio"
                checked={!useSaved}
                onChange={() => setUseSaved(false)}
                className="rounded"
              />
              새 배송지 입력
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="수령인" value={recipient} onChange={(e) => setRecipient(e.target.value)} required={!useSaved} />
              <Input label="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} required={!useSaved} />
              <Input label="우편번호" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required={!useSaved} className="sm:col-span-2" />
              <Input label="주소" value={address1} onChange={(e) => setAddress1(e.target.value)} required={!useSaved} className="sm:col-span-2" />
              <Input label="상세주소" value={address2} onChange={(e) => setAddress2(e.target.value)} className="sm:col-span-2" />
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-[var(--muted)]">
        결제는 주문 완료 후 &quot;결제 완료&quot;로 처리됩니다. (데모: 실제 결제 미연동)
      </p>

      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "처리 중..." : "주문하기"}
      </Button>
    </form>
  );
}
