import { LazyMediaConverter } from "@/components/shared/media-converter-lazy";
import { workspaceTargets } from "@/lib/conversion-pairs";

export function AudioConverter({ defaultTarget }: { defaultTarget?: string } = {}) {
  return <LazyMediaConverter kind="audio" title="Audio workbench" description="Convert tracks between MP3, WAV, FLAC, AAC, OGG, and M4A." formats={workspaceTargets("audio")} defaultTarget={defaultTarget} />;
}
