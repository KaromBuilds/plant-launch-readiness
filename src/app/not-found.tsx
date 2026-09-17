import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-medium text-neutral-300">Not found</p>
      <p className="text-xs text-neutral-500">
        This page doesn&apos;t exist, the plant doesn&apos;t exist, or you
        don&apos;t have access to it.
      </p>
      <Link
        href="/"
        className="text-xs text-neutral-400 underline hover:text-neutral-100"
      >
        Back to my plants
      </Link>
    </main>
  );
}
