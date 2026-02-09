const AdminLoading = () => (
  <div className="space-y-6">
    <div className="h-8 w-48 rounded-xl bg-[var(--surface)] animate-pulse" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="clay-card p-6 animate-pulse">
          <div className="h-4 w-20 rounded mb-2" />
          <div className="h-7 w-24 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default AdminLoading;
