import type { OwnerRole } from "@/lib/supabase/types";

export const OWNER_ROLES: { role: OwnerRole; label: string }[] = [
  { role: "program", label: "Program Owner" },
  { role: "operational", label: "Operational Owner" },
  { role: "training_safety", label: "Training/Safety Owner" },
];
