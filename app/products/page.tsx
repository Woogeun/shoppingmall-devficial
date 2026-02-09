import { Suspense } from "react";

import { ProductGrid, ProductSearch } from "@/features/products";
import { prisma } from "@/lib/prisma";

const getProducts = async (search?: string, category?: string) => {
  const where: {
    category?: string;
    name?: { contains: string };
    published: boolean;
  } = { published: true };
  if (search) where.name = { contains: search };
  if (category) where.category = category;

  const [products, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { inventory: { where: { quantity: { gt: 0 } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);
  const categories = categoryRows
    .map(({ category: c }) => c)
    .filter(Boolean)
    .sort();

  return { categories, products };
};

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const { category, q } = await searchParams;
  const { categories, products } = await getProducts(q, category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">상품 검색</h1>
      <ProductSearch
        categories={categories}
        defaultCategory={category}
        defaultQuery={q}
      />
      <Suspense fallback={<div className="text-[var(--muted)] py-8">로딩 중...</div>}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
