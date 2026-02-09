import { notFound } from "next/navigation";

import {
  MarketingDeleteButton,
  MarketingForm,
} from "@/features/admin";
import { prisma } from "@/lib/prisma";

type EditMarketingPageProps = {
  params: Promise<{ id: string }>;
};

const EditMarketingPage = async ({ params }: EditMarketingPageProps) => {
  const { id } = await params;
  const content = await prisma.marketingContent.findUnique({ where: { id } });
  if (!content) notFound();

  const {
    active,
    content: contentBody,
    endAt,
    imageUrl,
    linkUrl,
    sortOrder,
    startAt,
    title,
    type,
  } = content;
  const initial = {
    active,
    content: contentBody ?? "",
    endAt: endAt ? endAt.toISOString().slice(0, 16) : "",
    imageUrl: imageUrl ?? "",
    linkUrl: linkUrl ?? "",
    sortOrder,
    startAt: startAt ? startAt.toISOString().slice(0, 16) : "",
    title,
    type,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-foreground">마케팅 콘텐츠 수정</h1>
        <MarketingDeleteButton contentId={content.id} />
      </div>
      <MarketingForm contentId={content.id} initial={initial} />
    </div>
  );
};

export default EditMarketingPage;
