"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/features/ui";

type ProductData = {
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  name: string;
  price: string;
  published: boolean;
  slug: string;
};

const DEFAULT_PRODUCT: ProductData = {
  brand: "",
  category: "스니커즈",
  description: "",
  imageUrl: "",
  name: "",
  price: "",
  published: true,
  slug: "",
};

type InventoryRow = { quantity: string; size: string };

type ProductFormProps = {
  initial?: Partial<ProductData>;
  initialInventory?: InventoryRow[];
  productId?: string;
};

export const ProductForm = ({
  initial,
  initialInventory = [],
  productId,
}: ProductFormProps) => {
  const router = useRouter();
  const [data, setData] = useState<ProductData>({
    ...DEFAULT_PRODUCT,
    ...initial,
  });
  const [error, setError] = useState("");
  const [inventory, setInventory] = useState<InventoryRow[]>(
    initialInventory.length > 0 ? initialInventory : []
  );
  const [loading, setLoading] = useState(false);

  const slugFromName = data.name
    ? data.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9가-힣-]/g, "")
        .toLowerCase() || ""
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = {
      brand: data.brand,
      category: data.category,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      inventory: inventory
        .filter((i) => i.size.trim())
        .map((i) => ({
          quantity: parseInt(i.quantity, 10) || 0,
          size: i.size.trim(),
        })),
      name: data.name,
      price: parseInt(data.price, 10) || 0,
      published: data.published,
      slug: data.slug || slugFromName,
    };
    if (!payload.name || !payload.slug || payload.price < 0) {
      setError("이름, 슬러그, 가격을 입력해주세요.");
      return;
    }
    setLoading(true);
    const url = productId
      ? `/api/admin/products/${productId}`
      : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";
    const res = await fetch(url, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method,
    });
    const result = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form
      className="clay-card p-6 space-y-6 max-w-2xl"
      onSubmit={handleSubmit}
    >
      <Input
        label="상품명"
        required
        value={data.name}
        onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
      />
      <Input
        label="슬러그 (URL)"
        placeholder={slugFromName}
        value={data.slug || slugFromName}
        onChange={(e) => setData((d) => ({ ...d, slug: e.target.value }))}
      />
      <div>
        <label className="block text-sm font-medium mb-1.5">설명</label>
        <textarea
          className="input-soft w-full px-4 py-2.5 min-h-[100px]"
          value={data.description}
          onChange={(e) =>
            setData((d) => ({ ...d, description: e.target.value }))
          }
        />
      </div>
      <Input
        label="가격 (원)"
        min={0}
        required
        type="number"
        value={data.price}
        onChange={(e) => setData((d) => ({ ...d, price: e.target.value }))}
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
          checked={data.published}
          type="checkbox"
          onChange={(e) =>
            setData((d) => ({ ...d, published: e.target.checked }))
          }
        />
        <span className="text-sm">판매 공개</span>
      </label>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">재고 (사이즈별)</label>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() =>
              setInventory((i) => [...i, { quantity: "0", size: "" }])
            }
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
                    prev.map((p, i) =>
                      i === idx ? { ...p, size: e.target.value } : p
                    )
                  )
                }
              />
              <input
                className="input-soft w-24 px-2 py-1.5"
                min={0}
                placeholder="수량"
                type="number"
                value={inv.quantity}
                onChange={(e) =>
                  setInventory((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, quantity: e.target.value } : p
                    )
                  )
                }
              />
              <button
                className="text-red-600 text-sm"
                type="button"
                onClick={() =>
                  setInventory((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button disabled={loading} type="submit">
        {loading ? "저장 중..." : productId ? "수정" : "등록"}
      </Button>
    </form>
  );
};
