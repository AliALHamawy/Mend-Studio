import { ConversionWorkspace } from "@/components/shared/conversion-workspace";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Audio Converter",
    description:
      "Convert MP3, WAV, FLAC, AAC, OGG, and M4A audio securely. Private FFmpeg-powered audio conversion with no account required.",
    path: "/convert/audio",
    keywords: [
      "audio converter",
      "convert MP3 WAV FLAC",
      "private audio conversion",
      "FFmpeg audio converter",
      "secure media converter",
    ],
  });
}

export default function AudioConvertPage() {
  return <ConversionWorkspace workspace="audio" />;
}
