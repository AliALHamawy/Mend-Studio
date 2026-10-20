import { DownloadIcon } from "lucide-react";

export function DownloadButton({ href, filename }: { href: string; filename: string }) {
  return (
    <a href={href} download={filename} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
      <DownloadIcon className="size-4" />
      Download again
    </a>
  );
}
