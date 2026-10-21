import { MediaConverter } from "@/components/shared/media-converter";

export function VideoConverter() {
  return <MediaConverter kind="video" title="Video workbench" description="Move between MP4, WebM, MKV, MOV, and AVI with FFmpeg." formats={["mp4", "webm", "mkv", "mov", "avi"]} />;
}
