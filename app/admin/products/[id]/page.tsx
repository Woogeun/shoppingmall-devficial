import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });
  if (!product) notFound();

  const initial = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: String(product.price),
    imageUrl: product.imageUrl ?? "",
    category: product.category,
    brand: product.brand,
    published: product.published,
  };

  const initialInventory = product.inventory.map((i) => ({
    size: i.size,
    quantity: String(i.quantity),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">상품 수정</h1>
      <ProductForm
        productId={product.id}
        initial={initial}
        initialInventory={initialInventory}
      />
      <div className="mt-4 text-sm text-[var(--muted)]">
        재고는 아래 재고 관리에서 수정할 수 있습니다.
      </div>
    </div>
  );
}
