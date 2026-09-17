import { createClient } from "@/lib/supabase/server";
import type { OwnerRole } from "@/lib/supabase/types";

export type Assignment = {
  id: string;
  plant_id: string;
  role: OwnerRole;
  person_name: string;
  assigned_at: string;
};

export async function getOwnerAssignments(plantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owner_assignments")
    .select("id, plant_id, role, person_name, assigned_at")
    .eq("plant_id", plantId);

  if (error) throw error;
  return data as Assignment[];
}
