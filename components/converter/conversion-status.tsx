export function ConversionStatus({ error, working, output }: { error?: string; working?: boolean; output?: string }) {
  if (error) return <p className="rounded-2xl border border-red-200/80 bg-red-50/70 p-4 text-sm text-red-700" role="alert">{error}</p>;
  if (working) return <p className="rounded-2xl border border-white/90 bg-white/50 p-4 text-sm text-zinc-600 shadow-[inset_0_1px_2px_rgba(255,255,255,1)]" role="status">Converting your file…</p>;
  if (output) return <p className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-sm text-emerald-700" role="status">{output}</p>;
  return null;
}
