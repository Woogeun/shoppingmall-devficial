"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/features/ui";

type MarketingDeleteButtonProps = {
  contentId: string;
};

export const MarketingDeleteButton = ({ contentId }: MarketingDeleteButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = window.confirm(
      "이 마케팅 콘텐츠를 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다."
    );
    if (!ok) return;

    const res = await fetch(`/api/admin/marketing/${contentId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "콘텐츠 삭제에 실패했습니다.");
      return;
    }
    router.push("/admin/marketing");
    router.refresh();
  };

  return (
    <Button
      className="text-xs px-3 py-1.5"
      size="sm"
      type="button"
      variant="danger"
      onClick={handleDelete}
    >
      삭제
    </Button>
  );
};
