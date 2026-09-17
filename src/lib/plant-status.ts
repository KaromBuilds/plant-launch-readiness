import { getLaunchReadiness } from "@/lib/launch-readiness";
import type { Assignment } from "@/lib/owner-assignments";

export type PlantStatus = "ready" | "locked" | "conflict";

export function getPlantStatus(
  plantId: string,
  allAssignments: Assignment[],
  plantNamesById: Record<string, string>,
): PlantStatus {
  const plantAssignments = allAssignments.filter(
    (a) => a.plant_id === plantId,
  );
  const readiness = getLaunchReadiness(
    plantId,
    plantAssignments,
    allAssignments,
    plantNamesById,
  );

  if (readiness.conflicts.length > 0) return "conflict";
  if (readiness.missingRoles.length > 0) return "locked";
  return "ready";
}
