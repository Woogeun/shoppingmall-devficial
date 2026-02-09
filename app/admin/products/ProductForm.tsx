"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ProductData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  brand: string;
  published: boolean;
};

const defaultProduct: ProductData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "스니커즈",
  brand: "",
  published: true,
};

export function ProductForm({
  productId,
  initial,
  initialInventory = [],
}: {
  productId?: string;
  initial?: Partial<ProductData>;
  initialInventory?: { size: string; quantity: string }[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ProductData>({ ...defaultProduct, ...initial });
  const [inventory, setInventory] = useState<{ size: string; quantity: string }[]>(
    initialInventory.length > 0 ? initialInventory : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slugFromName = data.name
    ? data.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9가-힣-]/g, "")
        .toLowerCase() || ""
    : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      name: data.name,
      slug: data.slug || slugFromName,
      description: data.description || null,
      price: parseInt(data.price, 10) || 0,
      imageUrl: data.imageUrl || null,
      category: data.category,
      brand: data.brand,
      published: data.published,
      inventory: inventory
        .filter((i) => i.size.trim())
        .map((i) => ({ size: i.size.trim(), quantity: parseInt(i.quantity, 10) || 0 })),
    };
    if (!payload.name || !payload.slug || payload.price < 0) {
      setError("이름, 슬러그, 가격을 입력해주세요.");
      return;
    }
    setLoading(true);
    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="clay-card p-6 space-y-6 max-w-2xl">
      <Input
        label="상품명"
        value={data.name}
        onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
        required
      />
      <Input
        label="슬러그 (URL)"
        value={data.slug || slugFromName}
        onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))}
        placeholder={slugFromName}
      />
      <div>
        <label className="block text-sm font-medium mb-1.5">설명</label>
        <textarea
          className="input-soft w-full px-4 py-2.5 min-h-[100px]"
          value={data.description}
          onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
        />
      </div>
      <Input
        label="가격 (원)"
        type="number"
        min={0}
        value={data.price}
        onChange={(e) => setData((d) => ({ ...d, price: e.target.value }))}
        required
      />
      <Input
        label="이미지 URL"
        value={data.imageUrl}
        onChange={(e) => setData((d) => ({ ...d, imageUrl: e.target.value }))}
      />
      <Input
        label="카테고리"
        value={data.category}
        onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))}
      />
      <Input
        label="브랜드"
        value={data.brand}
        onChange={(e) => setData((d) => ({ ...d, brand: e.target.value }))}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.published}
          onChange={(e) => setData((d) => ({ ...d, published: e.target.checked }))}
        />
        <span className="text-sm">판매 공개</span>
      </label>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">재고 (사이즈별)</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setInventory((i) => [...i, { size: "", quantity: "0" }])}
          >
            + 추가
          </Button>
        </div>
        <ul className="space-y-2">
          {inventory.map((inv, idx) => (
            <li key={idx} className="flex gap-2 items-center">
              <input
                className="input-soft w-20 px-2 py-1.5"
                placeholder="사이즈"
                value={inv.size}
                onChange={(e) =>
                  setInventory((prev) =>
                    prev.map((p, i) => (i === idx ? { ...p, size: e.target.value } : p))
                  )
                }
              />
              <input
                type="number"
                min={0}
                className="input-soft w-24 px-2 py-1.5"
                placeholder="수량"
                value={inv.quantity}
                onChange={(e) =>
                  setInventory((prev) =>
                    prev.map((p, i) => (i === idx ? { ...p, quantity: e.target.value } : p))
                  )
                }
              />
              <button
                type="button"
                onClick={() => setInventory((prev) => prev.filter((_, i) => i !== idx))}
                className="text-red-600 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : productId ? "수정" : "등록"}
      </Button>
    </form>
  );
}
