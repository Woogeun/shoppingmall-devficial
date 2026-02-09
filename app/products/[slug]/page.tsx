import { notFound } from "next/navigation";

import { AddToCartForm } from "@/features/products";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: { published: true, slug },
    include: {
      inventory: {
        where: { quantity: { gt: 0 } },
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product) notFound();

  const { brand, category, description, id, imageUrl, name, price } = product;
  const sizes = product.inventory.map((i) => ({
    quantity: i.quantity,
    size: i.size,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="clay-card floating-widget overflow-hidden rounded-2xl aspect-square max-h-[500px] bg-[var(--pastel-peach)]">
          {imageUrl ? (
            <img
              alt={name}
              className="w-full h-full object-cover"
              src={imageUrl}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              👟
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">
            {brand} · {category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            {name}
          </h1>
          <p className="mt-4 text-xl font-semibold text-foreground">
            {formatPrice(price)}
          </p>
          {description && (
            <p className="mt-4 text-[var(--muted)] whitespace-pre-wrap">
              {description}
            </p>
          )}
          <AddToCartForm
            isLoggedIn={!!session}
            price={price}
            productId={id}
            productName={name}
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
