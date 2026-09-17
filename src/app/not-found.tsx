import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm font-medium text-neutral-300">No encontrado</p>
      <p className="text-xs text-neutral-500">
        Esta página no existe, o la planta no existe, o no tienes acceso a
        ella.
      </p>
      <Link
        href="/"
        className="text-xs text-neutral-400 underline hover:text-neutral-100"
      >
        Volver a mis plantas
      </Link>
    </main>
  );
}
