const ProductsLoading = () => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div className="h-8 w-40 rounded-xl bg-[var(--surface)] animate-pulse mb-8" />
    <div className="clay-card p-6 h-20 animate-pulse mb-8" />
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="clay-card p-4 animate-pulse">
          <div className="aspect-square rounded-xl bg-[var(--surface-elevated)] mb-3" />
          <div className="h-4 w-3/4 rounded mb-2" />
          <div className="h-5 w-1/2 rounded mb-2" />
          <div className="h-5 w-1/3 rounded" />
        </li>
      ))}
    </ul>
  </div>
);

export default ProductsLoading;
