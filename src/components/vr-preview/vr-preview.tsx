export function VRPreview({ locked }: { locked: boolean }) {
  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-10 text-center">
        <LockIcon />
        <p className="text-sm font-medium text-neutral-300">
          Vista previa VR bloqueada
        </p>
        <p className="text-xs text-neutral-500">
          Asigna los tres dueños para desbloquear la simulación.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-800 bg-neutral-950 p-10 text-center">
      <p className="text-sm font-medium text-emerald-400">
        Vista previa VR desbloqueada
      </p>
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
