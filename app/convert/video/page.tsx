import { ConversionWorkspace } from "@/components/shared/conversion-workspace";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Video Converter",
    description:
      "Convert MP4, WebM, MKV, MOV, and AVI video privately. Fast, secure FFmpeg video conversion for sharing, editing, and archiving.",
    path: "/convert/video",
    keywords: [
      "video converter",
      "convert MP4 WebM MKV",
      "private video conversion",
      "FFmpeg video converter",
      "secure local media converter",
    ],
  });
}

export default function VideoConvertPage() {
  return <ConversionWorkspace workspace="video" />;
}
