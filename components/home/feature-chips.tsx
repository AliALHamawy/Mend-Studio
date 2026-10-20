import { cn } from "@/lib/utils";

const formats = ["JPG", "PNG", "WEBP", "AVIF"];

export function FeatureChips() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Supported image formats">
      {formats.map((format, index) => (
        <span key={format} className={cn("rounded-full border px-3 py-2 text-[10px] tracking-[0.08em]", index === 0 ? "border-foreground bg-card text-foreground" : "border-border text-muted-foreground")}>
          {format}
        </span>
      ))}
      <span className="ml-1 text-xs text-muted">+ audio & video</span>
    </div>
  );
}
