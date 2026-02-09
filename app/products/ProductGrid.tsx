import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product, Inventory } from "@prisma/client";

type ProductWithInventory = Product & { inventory: Inventory[] };

export function ProductGrid({ products }: { products: ProductWithInventory[] }) {
  if (products.length === 0) {
    return (
      <div className="clay-card p-12 text-center text-[var(--muted)]">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
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
            {p.inventory.length === 0 && <p className="text-xs text-red-600 mt-1">품절</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
