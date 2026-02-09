"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/features/ui";
import { Input } from "@/features/ui";

type ProductSearchProps = {
  categories: string[];
  defaultCategory?: string;
  defaultQuery?: string;
};

export const ProductSearch = ({
  categories,
  defaultCategory,
  defaultQuery,
}: ProductSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      router.push(`/products?${next.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="clay-card p-4 sm:p-6 mb-8">
      <form
        className="flex flex-col sm:flex-row gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const q = (form.querySelector('input[name="q"]') as HTMLInputElement)?.value;
          updateParams({ category: defaultCategory, q: q || undefined });
        }}
      >
        <div className="flex-1">
          <Input
            className="w-full"
            defaultValue={defaultQuery}
            name="q"
            placeholder="상품명 검색"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="input-soft px-4 py-2.5 rounded-xl min-w-[120px]"
            value={defaultCategory ?? ""}
            onChange={(e) =>
              updateParams({
                category: e.target.value || undefined,
                q: searchParams.get("q") ?? undefined,
              })
            }
          >
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button type="submit">검색</Button>
        </div>
      </form>
    </div>
  );
};
