import { ArrowUpRightIcon } from "lucide-react";

export function MediaStrip() {
  return (
    <section className="flex flex-col gap-4 border-y border-line py-6 sm:flex-row sm:items-center sm:gap-10">
      <div className="flex min-w-64 items-center justify-between gap-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">Now available</span>
        <strong className="text-base text-ink">Audio + video</strong>
      </div>
      <p className="flex-1 text-sm text-muted">When the file has a soundtrack, we bring the studio.</p>
      <ArrowUpRightIcon className="size-5 text-signal" aria-hidden="true" />
    </section>
  );
}
