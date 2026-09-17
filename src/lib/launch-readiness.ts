import { OWNER_ROLES } from "@/lib/owner-roles";
import type { Assignment } from "@/lib/owner-assignments";
import type { OwnerRole } from "@/lib/supabase/types";

export type Conflict = {
  role: OwnerRole;
  personName: string;
  conflictsWith: { plantId: string; plantName: string; role: OwnerRole }[];
};

export type LaunchReadiness = {
  locked: boolean;
  missingRoles: typeof OWNER_ROLES;
  conflicts: Conflict[];
};

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

/**
 * A person is a conflict if the same name appears in more than one
 * (plant, role) slot across the manager's plants — a different role in this
 * plant, or any role in another plant — since that's a single point of
 * failure the flow is meant to catch.
 */
export function getLaunchReadiness(
  currentPlantId: string,
  currentPlantAssignments: Assignment[],
  allManagedAssignments: Assignment[],
  plantNamesById: Record<string, string>,
): LaunchReadiness {
  const assignedRoles = new Set(currentPlantAssignments.map((a) => a.role));
  const missingRoles = OWNER_ROLES.filter((r) => !assignedRoles.has(r.role));

  const conflicts: Conflict[] = [];
  for (const assignment of currentPlantAssignments) {
    const normalized = normalizeName(assignment.person_name);
    const conflictsWith = allManagedAssignments
      .filter(
        (other) =>
          normalizeName(other.person_name) === normalized &&
          !(other.plant_id === currentPlantId && other.role === assignment.role),
      )
      .map((other) => ({
        plantId: other.plant_id,
        plantName: plantNamesById[other.plant_id] ?? "another plant",
        role: other.role,
      }));

    if (conflictsWith.length > 0) {
      conflicts.push({
        role: assignment.role,
        personName: assignment.person_name,
        conflictsWith,
      });
    }
  }

  return {
    locked: missingRoles.length > 0 || conflicts.length > 0,
    missingRoles,
    conflicts,
  };
}
