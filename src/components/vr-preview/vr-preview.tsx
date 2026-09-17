import { VRScene } from "@/components/vr-preview/vr-scene";

export function VRPreview({ locked }: { locked: boolean }) {
  if (locked) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-10 text-center">
        <LockIcon />
        <p className="text-sm font-medium text-neutral-300">
          VR preview locked
        </p>
        <p className="text-xs text-neutral-500">
          Assign all three owners to unlock the simulation.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-emerald-800">
      <VRScene />
      {/* Persistent seal: always shown while unlocked, no dismiss control. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-3">
        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300">
          PERFORMANCE IN SIMULATION
        </span>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-8 w-8 text-neutral-500"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
