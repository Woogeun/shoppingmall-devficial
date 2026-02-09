import Link from "next/link";

export const Footer = () => (
  <footer className="mt-auto clay-card border-x-0 border-b-0 rounded-none">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">👟</span>
          Shoe Mall
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-[var(--muted)]">
          <Link className="hover:text-foreground transition-colors" href="/products">
            상품보기
          </Link>
          <Link className="hover:text-foreground transition-colors" href="/my/orders">
            주문조회
          </Link>
          <Link className="hover:text-foreground transition-colors" href="/admin">
            관리자
          </Link>
        </nav>
      </div>
      <p className="mt-6 text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} Shoe Mall. All rights reserved.
      </p>
    </div>
  </footer>
);
