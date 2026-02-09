const CheckoutLoading = () => (
  <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div className="h-8 w-32 rounded-xl bg-[var(--surface)] animate-pulse mb-6" />
    <div className="space-y-6">
      <div className="clay-card p-6 h-40 animate-pulse" />
      <div className="clay-card p-6 h-64 animate-pulse" />
    </div>
  </div>
);

export default CheckoutLoading;
