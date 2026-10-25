import { LazyMediaConverter } from "@/components/shared/media-converter-lazy";
import { workspaceTargets } from "@/lib/conversion-pairs";

export function VideoConverter({ defaultTarget }: { defaultTarget?: string } = {}) {
  return <LazyMediaConverter kind="video" title="Video workbench" description="Move between MP4, WebM, MKV, MOV, and AVI with FFmpeg." formats={workspaceTargets("video")} defaultTarget={defaultTarget} />;
}
