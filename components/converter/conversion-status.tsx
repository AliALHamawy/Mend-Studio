export function ConversionStatus({ error, working, progress, status, output }: { error?: string; working?: boolean; progress?: number | null; status?: string; output?: string }) {
  if (error) return <p className="rounded-2xl border border-red-200/80 bg-red-50/70 p-4 text-sm text-red-700" role="alert">{error}</p>;
  if (working) {
    const percent = typeof progress === "number" ? progress : null;
    return (
      <div className="rounded-2xl border border-white/90 bg-white/50 p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,1)]" role="status">
        <div className="flex items-center justify-between gap-3 text-sm text-zinc-600">
          <span>{status ?? "Converting your file…"}</span>
          {percent !== null && <span className="font-semibold tabular-nums text-zinc-900">{percent}%</span>}
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200/80"
          role="progressbar"
          aria-label="Conversion progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent ?? undefined}
        >
          {percent === null ? (
            <div className="h-full w-1/3 rounded-full bg-zinc-400/70 motion-safe:animate-pulse" />
          ) : (
            <div className="h-full rounded-full bg-zinc-900 transition-[width] duration-300" style={{ width: `${percent}%` }} />
          )}
        </div>
      </div>
    );
  }
  if (output) return <p className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-sm text-emerald-700" role="status">{output}</p>;
  return null;
}
