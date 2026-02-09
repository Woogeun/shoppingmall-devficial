import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartForm } from "./AddToCartForm";
import { getSession } from "@/lib/auth";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: { slug, published: true },
    include: { inventory: { where: { quantity: { gt: 0 } }, orderBy: { size: "asc" } } },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="clay-card floating-widget overflow-hidden rounded-2xl aspect-square max-h-[500px] bg-[var(--pastel-peach)]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">👟</div>
          )}
        </div>
        <div>
          <p className="text-sm text-[var(--muted)]">{product.brand} · {product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{product.name}</h1>
          <p className="mt-4 text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
          {product.description && (
            <p className="mt-4 text-[var(--muted)] whitespace-pre-wrap">{product.description}</p>
          )}

          <AddToCartForm
            productId={product.id}
            productName={product.name}
            price={product.price}
            sizes={product.inventory.map((i) => ({ size: i.size, quantity: i.quantity }))}
            isLoggedIn={!!session}
          />
        </div>
      </div>
    </div>
  );
}
