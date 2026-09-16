import { createClient } from "@/lib/supabase/server";

export async function getOwnerAssignments(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owner_assignments")
    .select("id, plant_id, role, person_name, assigned_at")
    .eq("plant_id", plantId);

  if (error) throw error;
  return data;
}
