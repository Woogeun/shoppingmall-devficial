const CartLoading = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div className="h-8 w-48 rounded-xl bg-[var(--surface)] animate-pulse mb-6" />
    <div className="clay-card p-8 flex flex-col items-center justify-center gap-4">
      <div className="h-6 w-32 rounded-lg bg-[var(--surface-elevated)] animate-pulse" />
      <div className="h-10 w-40 rounded-xl bg-[var(--surface-elevated)] animate-pulse" />
    </div>
  </div>
);

export default CartLoading;
