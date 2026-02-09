import { prisma } from "@/lib/prisma";
import { InventoryEdit } from "./InventoryEdit";

export default async function AdminInventoryPage() {
  const items = await prisma.inventory.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: [{ product: { name: "asc" } }, { size: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">재고 관리</h1>
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-medium text-foreground">상품</th>
                <th className="p-4 font-medium text-foreground">사이즈</th>
                <th className="p-4 font-medium text-foreground">수량</th>
                <th className="p-4 font-medium text-foreground">관리</th>
              </tr>
            </thead>
            <tbody>
              {items.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--border)]">
                  <td className="p-4 font-medium text-foreground">{inv.product.name}</td>
                  <td className="p-4">{inv.size}</td>
                  <td className="p-4">
                    <span className={inv.quantity <= 5 ? "text-amber-600 font-medium" : ""}>
                      {inv.quantity}개
                    </span>
                  </td>
                  <td className="p-4">
                    <InventoryEdit inventoryId={inv.id} currentQuantity={inv.quantity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="p-12 text-center text-[var(--muted)]">재고 데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
