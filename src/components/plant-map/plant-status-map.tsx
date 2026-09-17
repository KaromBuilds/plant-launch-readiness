"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getPlantStatus, type PlantStatus } from "@/lib/plant-status";
import type { Assignment } from "@/lib/owner-assignments";

type Plant = { id: string; name: string; lat: number; lng: number };

const STATUS_STYLES: Record<PlantStatus, { fill: string; label: string }> = {
  ready: { fill: "#34d399", label: "Listo" },
  locked: { fill: "#f59e0b", label: "Bloqueado" },
  conflict: { fill: "#ef4444", label: "Conflicto" },
};

const WIDTH = 400;
const HEIGHT = 260;
const PAD_DEGREES = 1;

export function PlantStatusMap({
  plants,
  initialAssignments,
}: {
  plants: Plant[];
  initialAssignments: Assignment[];
}) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("owner_assignments:map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "owner_assignments" },
        (payload) => {
          setAssignments((current) => {
            if (payload.eventType === "DELETE") {
              const oldRow = payload.old as { id: string };
              return current.filter((a) => a.id !== oldRow.id);
            }
            const row = payload.new as Assignment;
            return [
              ...current.filter(
                (a) => !(a.plant_id === row.plant_id && a.role === row.role),
              ),
              row,
            ];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const plantNamesById = useMemo(
    () => Object.fromEntries(plants.map((p) => [p.id, p.name])),
    [plants],
  );

  const bounds = useMemo(() => {
    const lats = plants.map((p) => p.lat);
    const lngs = plants.map((p) => p.lng);
    return {
      minLat: Math.min(...lats) - PAD_DEGREES,
      maxLat: Math.max(...lats) + PAD_DEGREES,
      minLng: Math.min(...lngs) - PAD_DEGREES,
      maxLng: Math.max(...lngs) + PAD_DEGREES,
    };
  }, [plants]);

  function project(lat: number, lng: number) {
    const x =
      ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * WIDTH;
    // Latitude increases northward; SVG y increases downward.
    const y =
      HEIGHT -
      ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * HEIGHT;
    return { x, y };
  }

  if (plants.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-400">
          Mapa de plantas
        </h2>
        <ul className="flex gap-3 text-xs text-neutral-400">
          {(Object.entries(STATUS_STYLES) as [PlantStatus, (typeof STATUS_STYLES)[PlantStatus]][]).map(
            ([status, style]) => (
              <li key={status} className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: style.fill }}
                />
                {style.label}
              </li>
            ),
          )}
        </ul>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-4 w-full rounded-lg bg-neutral-950"
        role="img"
        aria-label="Mapa de estado de lanzamiento de las plantas"
      >
        <defs>
          <pattern
            id="plant-map-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#1f2937"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#plant-map-grid)" />

        {plants.map((plant) => {
          const { x, y } = project(plant.lat, plant.lng);
          const status = getPlantStatus(plant.id, assignments, plantNamesById);
          const style = STATUS_STYLES[status];
          return (
            <g key={plant.id} transform={`translate(${x}, ${y})`}>
              <circle
                r={8}
                fill={style.fill}
                stroke="#050505"
                strokeWidth={2}
              />
              <text
                x={0}
                y={-14}
                textAnchor="middle"
                className="fill-neutral-300 text-[10px]"
              >
                {plant.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
