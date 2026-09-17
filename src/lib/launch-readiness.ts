import { OWNER_ROLES } from "@/lib/owner-roles";
import type { Assignment } from "@/lib/owner-assignments";

export type LaunchReadiness = {
  locked: boolean;
  missingRoles: typeof OWNER_ROLES;
};

export function getLaunchReadiness(assignments: Assignment[]): LaunchReadiness {
  const assignedRoles = new Set(assignments.map((a) => a.role));
  const missingRoles = OWNER_ROLES.filter((r) => !assignedRoles.has(r.role));

  return {
    locked: missingRoles.length > 0,
    missingRoles,
  };
}
