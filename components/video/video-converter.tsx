import { LazyMediaConverter } from "@/components/shared/media-converter-lazy";

export function VideoConverter() {
  return <LazyMediaConverter kind="video" title="Video workbench" description="Move between MP4, WebM, MKV, MOV, and AVI with FFmpeg." formats={["mp4", "webm", "mkv", "mov", "avi"]} />;
}
