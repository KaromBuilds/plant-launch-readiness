export default function Loading() {
  return (
    <main className="flex flex-1 flex-col p-8">
      <div className="h-6 w-56 animate-pulse rounded bg-neutral-800" />
      <div className="mt-8 h-4 w-24 animate-pulse rounded bg-neutral-800" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
          />
        ))}
      </div>
    </main>
  );
}
