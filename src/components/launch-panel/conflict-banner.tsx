import { OWNER_ROLES } from "@/lib/owner-roles";
import type { Conflict } from "@/lib/launch-readiness";
import type { OwnerRole } from "@/lib/supabase/types";

const ROLE_LABELS: Record<OwnerRole, string> = Object.fromEntries(
  OWNER_ROLES.map((r) => [r.role, r.label]),
) as Record<OwnerRole, string>;

export function ConflictBanner({ conflicts }: { conflicts: Conflict[] }) {
  if (conflicts.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-800 bg-red-950/60 p-4"
    >
      <p className="text-sm font-semibold text-red-300">
        Risk: single point of failure
      </p>
      <ul className="mt-2 space-y-1 text-xs text-red-200">
        {conflicts.map((conflict) => (
          <li key={`${conflict.role}-${conflict.personName}`}>
            {conflict.personName} is assigned as{" "}
            {ROLE_LABELS[conflict.role]} and also as{" "}
            {conflict.conflictsWith
              .map((c) => `${ROLE_LABELS[c.role]} at ${c.plantName}`)
              .join(", ")}
            . Separate these responsibilities before launching.
          </li>
        ))}
      </ul>
    </div>
  );
}
