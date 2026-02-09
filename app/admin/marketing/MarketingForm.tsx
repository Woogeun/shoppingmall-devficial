"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const TYPES = [
  { value: "BANNER", label: "배너" },
  { value: "PROMO", label: "프로모션" },
  { value: "NOTICE", label: "공지" },
] as const;

type FormData = {
  title: string;
  type: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  startAt: string;
  endAt: string;
  active: boolean;
  sortOrder: number;
};

export function MarketingForm({
  contentId,
  initial,
}: {
  contentId?: string;
  initial?: Partial<FormData>;
}) {
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    title: "",
    type: "BANNER",
    content: "",
    imageUrl: "",
    linkUrl: "",
    startAt: "",
    endAt: "",
    active: true,
    sortOrder: 0,
    ...initial,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!data.title) {
      setError("제목을 입력해주세요.");
      return;
    }
    setLoading(true);
    const url = contentId ? `/api/admin/marketing/${contentId}` : "/api/admin/marketing";
    const method = contentId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        type: data.type,
        content: data.content || null,
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        startAt: data.startAt ? new Date(data.startAt).toISOString() : null,
        endAt: data.endAt ? new Date(data.endAt).toISOString() : null,
        active: data.active,
        sortOrder: data.sortOrder,
      }),
    });
    const result = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    router.push("/admin/marketing");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="clay-card p-6 space-y-6 max-w-2xl">
      <Input
        label="제목"
        value={data.title}
        onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
        required
      />
      <div>
        <label className="block text-sm font-medium mb-1.5">유형</label>
        <select
          value={data.type}
          onChange={(e) => setData((d) => ({ ...d, type: e.target.value }))}
          className="input-soft w-full px-4 py-2.5"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">내용</label>
        <textarea
          className="input-soft w-full px-4 py-2.5 min-h-[80px]"
          value={data.content}
          onChange={(e) => setData((d) => ({ ...d, content: e.target.value }))}
        />
      </div>
      <Input
        label="이미지 URL"
        value={data.imageUrl}
        onChange={(e) => setData((d) => ({ ...d, imageUrl: e.target.value }))}
      />
      <Input
        label="링크 URL"
        value={data.linkUrl}
        onChange={(e) => setData((d) => ({ ...d, linkUrl: e.target.value }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="노출 시작"
          type="datetime-local"
          value={data.startAt}
          onChange={(e) => setData((d) => ({ ...d, startAt: e.target.value }))}
        />
        <Input
          label="노출 종료"
          type="datetime-local"
          value={data.endAt}
          onChange={(e) => setData((d) => ({ ...d, endAt: e.target.value }))}
        />
      </div>
      <Input
        label="정렬 순서"
        type="number"
        min={0}
        value={String(data.sortOrder)}
        onChange={(e) => setData((d) => ({ ...d, sortOrder: parseInt(e.target.value, 10) || 0 }))}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.active}
          onChange={(e) => setData((d) => ({ ...d, active: e.target.checked }))}
        />
        <span className="text-sm">노출 활성화</span>
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : contentId ? "수정" : "등록"}
      </Button>
    </form>
  );
}
