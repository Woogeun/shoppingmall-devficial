import { notFound } from "next/navigation";

import { ProductForm } from "@/features/admin";
import { prisma } from "@/lib/prisma";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });
  if (!product) notFound();

  const { brand, category, description, imageUrl, name, price, published, slug } = product;
  const initial = {
    brand,
    category,
    description: description ?? "",
    imageUrl: imageUrl ?? "",
    name,
    price: String(price),
    published,
    slug,
  };
  const initialInventory = product.inventory.map((i) => ({
    quantity: String(i.quantity),
    size: i.size,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">상품 수정</h1>
      <ProductForm
        initial={initial}
        initialInventory={initialInventory}
        productId={product.id}
      />
      <div className="mt-4 text-sm text-[var(--muted)]">
        재고는 아래 재고 관리에서 수정할 수 있습니다.
      </div>
    </div>
  );
};

export default EditProductPage;
