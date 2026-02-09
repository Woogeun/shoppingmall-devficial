import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "./ProductGrid";
import { ProductSearch } from "./ProductSearch";

async function getProducts(search?: string, category?: string) {
  const where: { published: boolean; name?: { contains: string }; category?: string } = {
    published: true,
  };
  if (search) where.name = { contains: search };
  if (category) where.category = category;

  const products = await prisma.product.findMany({
    where,
    include: { inventory: { where: { quantity: { gt: 0 } } } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.product.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  }).then((r) => r.map((c) => c.category).filter(Boolean).sort());

  return { products, categories };
}

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category } = await searchParams;
  const { products, categories } = await getProducts(q, category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">상품 검색</h1>
      <ProductSearch categories={categories} defaultQuery={q} defaultCategory={category} />
      <Suspense fallback={<div className="text-[var(--muted)] py-8">로딩 중...</div>}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
