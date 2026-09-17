"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OWNER_ROLES } from "@/lib/owner-roles";
import { validatePersonName } from "@/lib/validate-person-name";
import { getLaunchReadiness } from "@/lib/launch-readiness";
import { VRPreview } from "@/components/vr-preview/vr-preview";
import type { OwnerRole } from "@/lib/supabase/types";
import type { Assignment } from "@/lib/owner-assignments";

export type { Assignment };

const EMPTY_DRAFTS: Record<OwnerRole, string> = {
  program: "",
  operational: "",
  training_safety: "",
};

export function LaunchPanel({
  plantId,
  userId,
  initialAssignments,
}: {
  plantId: string;
  userId: string;
  initialAssignments: Assignment[];
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [drafts, setDrafts] = useState<Record<OwnerRole, string>>({
    ...EMPTY_DRAFTS,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<OwnerRole, string>>
  >({});
  const [submittingRole, setSubmittingRole] = useState<OwnerRole | null>(
    null,
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`owner_assignments:${plantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "owner_assignments",
          filter: `plant_id=eq.${plantId}`,
        },
        (payload) => {
          setAssignments((current) => {
            if (payload.eventType === "DELETE") {
              const oldRow = payload.old as { id: string };
              return current.filter((a) => a.id !== oldRow.id);
            }
            const row = payload.new as Assignment;
            return [...current.filter((a) => a.role !== row.role), row];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [plantId]);

  const byRole = useMemo(() => {
    const map = new Map<OwnerRole, Assignment>();
    for (const assignment of assignments) map.set(assignment.role, assignment);
    return map;
  }, [assignments]);

  const readiness = useMemo(() => getLaunchReadiness(assignments), [assignments]);
  const [launched, setLaunched] = useState(false);

  async function handleAssign(role: OwnerRole) {
    const result = validatePersonName(drafts[role]);
    if (!result.ok) {
      setFieldErrors((prev) => ({ ...prev, [role]: result.error }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, [role]: undefined }));
    setSubmittingRole(role);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("owner_assignments")
      .upsert(
        {
          plant_id: plantId,
          role,
          person_name: result.value,
          assigned_by: userId,
          assigned_at: new Date().toISOString(),
        },
        { onConflict: "plant_id,role" },
      )
      .select()
      .single();

    setSubmittingRole(null);

    if (error || !data) {
      setFieldErrors((prev) => ({
        ...prev,
        [role]: error?.message ?? "No se pudo guardar la asignación.",
      }));
      return;
    }

    // Optimistic update in case the realtime event lags behind.
    setAssignments((current) => [
      ...current.filter((a) => a.role !== role),
      data,
    ]);
    setDrafts((prev) => ({ ...prev, [role]: "" }));
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid gap-3">
      {OWNER_ROLES.map(({ role, label }) => {
        const assignment = byRole.get(role);
        const isSubmitting = submittingRole === role;

        return (
          <div
            key={role}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
          >
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs">
              {assignment ? (
                <span className="text-emerald-400">
                  Asignado: {assignment.person_name}
                </span>
              ) : (
                <span className="text-amber-400">Sin asignar</span>
              )}
            </p>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void handleAssign(role);
              }}
            >
              <input
                type="text"
                value={drafts[role]}
                onChange={(event) =>
                  setDrafts((prev) => ({ ...prev, [role]: event.target.value }))
                }
                placeholder={assignment ? "Reasignar a…" : "Nombre completo"}
                maxLength={80}
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-sm outline-none focus:border-neutral-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 transition disabled:opacity-50"
              >
                {assignment ? "Reasignar" : "Asignar"}
              </button>
            </form>
            {fieldErrors[role] && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors[role]}</p>
            )}
          </div>
        );
      })}
      </div>

      {readiness.locked && (
        <p className="text-xs text-amber-400">
          Roles faltantes:{" "}
          {readiness.missingRoles.map((r) => r.label).join(", ")}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={readiness.locked}
          onClick={() => setLaunched(true)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          Lanzar programa de rehearsal
        </button>
        {launched && !readiness.locked && (
          <p className="text-xs text-emerald-400">
            Programa lanzado en modo simulación.
          </p>
        )}
      </div>

      <VRPreview locked={readiness.locked} />
    </div>
  );
}
