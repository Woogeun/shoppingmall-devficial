import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { inventory: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">상품 관리</h1>
        <Link href="/admin/products/new">
          <Button>상품 등록</Button>
        </Link>
      </div>

      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-medium text-foreground">이미지</th>
                <th className="p-4 font-medium text-foreground">상품명</th>
                <th className="p-4 font-medium text-foreground">브랜드</th>
                <th className="p-4 font-medium text-foreground">가격</th>
                <th className="p-4 font-medium text-foreground">재고</th>
                <th className="p-4 font-medium text-foreground">상태</th>
                <th className="p-4 font-medium text-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)]">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--pastel-peach)] overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">👟</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-[var(--muted)]">{p.brand}</td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    {p.inventory.reduce((s, i) => s + i.quantity, 0)}개
                  </td>
                  <td className="p-4">
                    <span className={p.published ? "text-green-600" : "text-[var(--muted)]"}>
                      {p.published ? "판매중" : "미공개"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/products/${p.id}`} className="text-[var(--accent-strong)] hover:underline">
                      수정
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">등록된 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
