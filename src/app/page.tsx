import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getManagedPlants } from "@/lib/plants";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const plants = await getManagedPlants();

  return (
    <main className="flex flex-1 flex-col p-8">
      <header className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h1 className="text-lg font-semibold">Plant Launch Readiness</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">{user?.email}</span>
          <SignOutButton />
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-neutral-400">
          Tus plantas
        </h2>

        {plants.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No tienes plantas asignadas todavía. Pide a un administrador que
            te vincule en <code>plant_managers</code>.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant) => (
              <li key={plant.id}>
                <Link
                  href={`/plants/${plant.id}`}
                  className="block rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600"
                >
                  <p className="font-medium">{plant.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {plant.lat.toFixed(4)}, {plant.lng.toFixed(4)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
