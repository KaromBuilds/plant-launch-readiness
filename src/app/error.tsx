"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-medium text-red-400">Ocurrió un error</p>
      <p className="max-w-md text-xs text-neutral-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
      >
        Reintentar
      </button>
    </main>
  );
}
