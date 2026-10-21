import { LazyMediaConverter } from "@/components/shared/media-converter-lazy";

export function AudioConverter() {
  return <LazyMediaConverter kind="audio" title="Audio workbench" description="Convert tracks between MP3, WAV, FLAC, AAC, OGG, and M4A." formats={["mp3", "wav", "flac", "aac", "ogg", "m4a"]} />;
}
