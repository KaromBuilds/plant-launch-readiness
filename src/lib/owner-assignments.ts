import { createClient } from "@/lib/supabase/server";
import type { OwnerRole } from "@/lib/supabase/types";

export type Assignment = {
  id: string;
  plant_id: string;
  role: OwnerRole;
  person_name: string;
  assigned_at: string;
};

/**
 * All owner assignments across every plant the signed-in manager is linked
 * to (RLS scopes this — no explicit filter needed). Used both to render the
 * current plant's checklist and to detect cross-plant/cross-role conflicts.
 */
export async function getManagedAssignments(): Promise<Assignment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owner_assignments")
    .select("id, plant_id, role, person_name, assigned_at");

  if (error) throw error;
  return data;
}
