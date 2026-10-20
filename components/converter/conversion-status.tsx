export function ConversionStatus({ error, working, output }: { error?: string; working?: boolean; output?: string }) {
  if (error) return <p className="text-sm text-destructive" role="alert">{error}</p>;
  if (working) return <p className="text-sm text-muted-foreground" role="status">Converting your file…</p>;
  if (output) return <p className="text-sm text-accent" role="status">{output}</p>;
  return null;
}
