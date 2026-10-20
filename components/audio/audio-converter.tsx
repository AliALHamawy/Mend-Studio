import { ServerMediaConverter } from "@/components/shared/server-media-converter";

export function AudioConverter() {
  return <ServerMediaConverter kind="audio" title="Audio workbench" description="Convert tracks between MP3, WAV, FLAC, AAC, OGG, and M4A." formats={["mp3", "wav", "flac", "aac", "ogg", "m4a"]} />;
}
