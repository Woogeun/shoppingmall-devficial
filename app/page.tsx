import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [banners, products] = await Promise.all([
    prisma.marketingContent.findMany({
      where: { type: "BANNER", active: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    prisma.product.findMany({
      where: { published: true },
      include: { inventory: { where: { quantity: { gt: 0 } }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Banners */}
      {banners.length > 0 && (
        <section className="mb-10">
          <div className="flex flex-col gap-4 sm:gap-6">
            {banners.map((b) => (
              <Link
                key={b.id}
                href={b.linkUrl || "#"}
                className="block clay-card floating-widget overflow-hidden rounded-2xl"
              >
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-40 sm:h-52 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-52 bg-[var(--pastel-lavender)] flex items-center justify-center">
                    <span className="text-xl font-semibold text-foreground">{b.title}</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-foreground">{b.title}</h2>
                  {b.content && <p className="text-sm text-[var(--muted)] mt-1">{b.content}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">추천 상품</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--accent-strong)] hover:underline"
          >
            전체보기
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.slug}`}
                className="block clay-card floating-widget p-4 h-full transition-transform hover:scale-[1.02]"
              >
                <div className="aspect-square rounded-xl bg-[var(--pastel-peach)] overflow-hidden mb-3">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">👟</div>
                  )}
                </div>
                <p className="text-xs text-[var(--muted)]">{p.brand}</p>
                <h3 className="font-semibold text-foreground line-clamp-2">{p.name}</h3>
                <p className="mt-1 font-medium text-foreground">{formatPrice(p.price)}</p>
                {p.inventory.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">품절</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {products.length === 0 && (
          <div className="clay-card p-12 text-center text-[var(--muted)]">
            등록된 상품이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
