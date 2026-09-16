import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedPlant } from "@/lib/plants";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getManagedPlant(id);

  // RLS returns null both when the plant doesn't exist and when the signed-in
  // manager isn't linked to it — either way, treat it as not found.
  if (!plant) notFound();

  return (
    <main className="flex flex-1 flex-col p-8">
      <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-100">
        ← Todas las plantas
      </Link>
      <h1 className="mt-4 text-lg font-semibold">{plant.name}</h1>
      <p className="mt-1 text-xs text-neutral-500">
        {plant.lat.toFixed(4)}, {plant.lng.toFixed(4)}
      </p>

      <p className="mt-6 text-sm text-neutral-500">
        El panel de lanzamiento aparecerá aquí.
      </p>
    </main>
  );
}
