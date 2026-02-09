"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "홈" },
  { href: "/products", label: "상품" },
];

export function Header({
  session,
  cartCount,
}: {
  session: { name: string; role: string } | null;
  cartCount: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 clay-card border-x-0 border-t-0 rounded-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <span className="text-2xl">👟</span>
          <span className="hidden sm:inline">Shoe Mall</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[var(--pastel-lavender)] text-foreground"
                  : "text-[var(--muted)] hover:bg-[var(--pastel-peach)] hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-xl px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100/80 hover:bg-amber-200/80"
            >
              관리자
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-xl p-2.5 btn-soft bg-[var(--surface)] text-foreground hover:bg-[var(--pastel-mint)]"
            aria-label="장바구니"
          >
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--pastel-pink)] text-xs font-bold text-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          {session ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/my/orders"
                className="rounded-xl px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--pastel-sky)] hover:text-foreground"
              >
                주문내역
              </Link>
              <span className="rounded-xl bg-[var(--pastel-lavender)] px-3 py-2 text-sm font-medium">
                {session.name}
              </span>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="rounded-xl px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--pastel-peach)] hover:text-foreground">
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 btn-soft bg-[var(--pastel-mint)] text-sm font-medium text-foreground hover:bg-[var(--pastel-sky)]"
            >
              로그인
            </Link>
          )}

          <button
            type="button"
            className="rounded-xl p-2.5 md:hidden btn-soft bg-[var(--surface)]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="메뉴"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] px-4 py-3 md:hidden clay-card-pressed rounded-none">
          <nav className="flex flex-col gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 ${pathname === href ? "bg-[var(--pastel-lavender)]" : ""}`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-amber-700">
                관리자
              </Link>
            )}
            {session && (
              <>
                <Link href="/my/orders" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3">
                  주문내역
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="w-full rounded-xl px-4 py-3 text-left text-[var(--muted)]">
                    로그아웃
                  </button>
                </form>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
