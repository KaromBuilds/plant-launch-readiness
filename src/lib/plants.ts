import { createClient } from "@/lib/supabase/server";

export async function getManagedPlants() {
  const supabase = await createClient();
  // RLS scopes this to plants the signed-in user is linked to via
  // plant_managers — no other filtering needed here.
  const { data, error } = await supabase
    .from("plants")
    .select("id, name, lat, lng")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getManagedPlant(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plants")
    .select("id, name, lat, lng")
    .eq("id", plantId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
