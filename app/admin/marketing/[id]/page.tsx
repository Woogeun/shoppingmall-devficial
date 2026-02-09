import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarketingForm } from "../MarketingForm";
import { MarketingDeleteButton } from "../MarketingDeleteButton";

export default async function EditMarketingPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await prisma.marketingContent.findUnique({ where: { id } });
  if (!content) notFound();

  const initial = {
    title: content.title,
    type: content.type,
    content: content.content ?? "",
    imageUrl: content.imageUrl ?? "",
    linkUrl: content.linkUrl ?? "",
    startAt: content.startAt ? content.startAt.toISOString().slice(0, 16) : "",
    endAt: content.endAt ? content.endAt.toISOString().slice(0, 16) : "",
    active: content.active,
    sortOrder: content.sortOrder,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          마케팅 콘텐츠 수정
        </h1>
        <MarketingDeleteButton contentId={content.id} />
      </div>
      <MarketingForm contentId={content.id} initial={initial} />
    </div>
  );
}
