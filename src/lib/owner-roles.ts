import type { OwnerRole } from "@/lib/supabase/types";

export const OWNER_ROLES: { role: OwnerRole; label: string }[] = [
  { role: "program", label: "Dueño del Programa" },
  { role: "operational", label: "Dueño Operativo" },
  { role: "training_safety", label: "Dueño de Capacitación y Seguridad" },
];
