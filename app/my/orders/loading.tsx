const MyOrdersLoading = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div className="h-8 w-40 rounded-xl bg-[var(--surface)] animate-pulse mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="clay-card p-6 h-24 animate-pulse" />
      ))}
    </div>
  </div>
);

export default MyOrdersLoading;
