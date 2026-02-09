import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/products", label: "상품" },
  { href: "/admin/orders", label: "주문" },
  { href: "/admin/inventory", label: "재고" },
  { href: "/admin/users", label: "사용자" },
  { href: "/admin/marketing", label: "마케팅" },
  { href: "/admin/audit", label: "감사 로그" },
];

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?from=/admin");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="clay-card p-4 sticky top-24">
            <p className="text-xs font-medium text-[var(--muted)] mb-3">관리자</p>
            <ul className="space-y-1">
              {nav.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-[var(--pastel-lavender)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-4 block rounded-xl px-3 py-2 text-sm text-[var(--muted)] hover:text-foreground"
            >
              ← 쇼핑몰로
            </Link>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
