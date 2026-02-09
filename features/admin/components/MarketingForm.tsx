"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/features/ui";

const TYPES = [
  { label: "배너", value: "BANNER" },
  { label: "공지", value: "NOTICE" },
  { label: "프로모션", value: "PROMO" },
] as const;

type FormData = {
  active: boolean;
  content: string;
  endAt: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  startAt: string;
  title: string;
  type: string;
};

type MarketingFormProps = {
  contentId?: string;
  initial?: Partial<FormData>;
};

export const MarketingForm = ({
  contentId,
  initial,
}: MarketingFormProps) => {
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    active: true,
    content: "",
    endAt: "",
    imageUrl: "",
    linkUrl: "",
    sortOrder: 0,
    startAt: "",
    title: "",
    type: "BANNER",
    ...initial,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!data.title) {
      setError("제목을 입력해주세요.");
      return;
    }
    setLoading(true);
    const url = contentId
      ? `/api/admin/marketing/${contentId}`
      : "/api/admin/marketing";
    const method = contentId ? "PATCH" : "POST";
    const res = await fetch(url, {
      body: JSON.stringify({
        active: data.active,
        content: data.content || null,
        endAt: data.endAt ? new Date(data.endAt).toISOString() : null,
        imageUrl: data.imageUrl || null,
        linkUrl: data.linkUrl || null,
        sortOrder: data.sortOrder,
        startAt: data.startAt ? new Date(data.startAt).toISOString() : null,
        title: data.title,
        type: data.type,
      }),
      headers: { "Content-Type": "application/json" },
      method,
    });
    const result = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    router.push("/admin/marketing");
    router.refresh();
  };

  return (
    <form
      className="clay-card p-6 space-y-6 max-w-2xl"
      onSubmit={handleSubmit}
    >
      <Input
        label="제목"
        required
        value={data.title}
        onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
      />
      <div>
        <label className="block text-sm font-medium mb-1.5">유형</label>
        <select
          className="input-soft w-full px-4 py-2.5"
          value={data.type}
          onChange={(e) => setData((d) => ({ ...d, type: e.target.value }))}
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">내용</label>
        <textarea
          className="input-soft w-full px-4 py-2.5 min-h-[80px]"
          value={data.content}
          onChange={(e) =>
            setData((d) => ({ ...d, content: e.target.value }))
          }
        />
      </div>
      <Input
        label="이미지 URL"
        value={data.imageUrl}
        onChange={(e) =>
          setData((d) => ({ ...d, imageUrl: e.target.value }))
        }
      />
      <Input
        label="링크 URL"
        value={data.linkUrl}
        onChange={(e) =>
          setData((d) => ({ ...d, linkUrl: e.target.value }))
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="노출 시작"
          type="datetime-local"
          value={data.startAt}
          onChange={(e) =>
            setData((d) => ({ ...d, startAt: e.target.value }))
          }
        />
        <Input
          label="노출 종료"
          type="datetime-local"
          value={data.endAt}
          onChange={(e) =>
            setData((d) => ({ ...d, endAt: e.target.value }))
          }
        />
      </div>
      <Input
        label="정렬 순서"
        min={0}
        type="number"
        value={String(data.sortOrder)}
        onChange={(e) =>
          setData((d) => ({
            ...d,
            sortOrder: parseInt(e.target.value, 10) || 0,
          }))
        }
      />
      <label className="flex items-center gap-2">
        <input
          checked={data.active}
          type="checkbox"
          onChange={(e) =>
            setData((d) => ({ ...d, active: e.target.checked }))
          }
        />
        <span className="text-sm">노출 활성화</span>
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button disabled={loading} type="submit">
        {loading ? "저장 중..." : contentId ? "수정" : "등록"}
      </Button>
    </form>
  );
};
