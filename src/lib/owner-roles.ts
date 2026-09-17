import type { OwnerRole } from "@/lib/supabase/types";

export const OWNER_ROLES: { role: OwnerRole; label: string; description: string }[] = [
  {
    role: "program",
    label: "Program Owner",
    description: "Usually the Plant Manager.",
  },
  {
    role: "operational",
    label: "Operational Owner",
    description: "Usually the Operations or Brigade Coordinator.",
  },
  {
    role: "training_safety",
    label: "Training/Safety Owner",
    description: "Usually the Safety (EHS) Manager.",
  },
];
