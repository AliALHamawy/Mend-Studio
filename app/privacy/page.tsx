import type { Metadata } from "next";
import { ShieldCheckIcon } from "lucide-react";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Mend Studio protects your media with local-first, privacy-focused conversion for images, audio, and video.",
  path: "/privacy",
  keywords: ["Mend Studio privacy", "local-first media converter", "private file conversion"],
});

export default function PrivacyPage() {
  return (
    <div className="relative isolate flex-1 overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true"><div className="absolute left-1/2 top-1/4 size-[34rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl" /><div className="absolute bottom-1/4 left-1/4 size-[26rem] rounded-full bg-gradient-to-br from-orange-400/15 via-amber-200/20 to-transparent blur-3xl" /></div>
      <article className="mx-auto flex max-w-4xl flex-col gap-10 px-5 pb-8 pt-32 sm:px-8 lg:pt-40">
        <header className="border-b border-zinc-200 pb-10">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><ShieldCheckIcon className="size-4" aria-hidden="true" /> Local-first &amp; private</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Your files are yours.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">Mend Studio is built to convert media without turning your files into a product. This policy explains what we collect, what we do not, and how our conversion paths work.</p>
          <p className="mt-5 text-sm text-zinc-400">Last updated October 21, 2026</p>
        </header>
        <div className="grid gap-8 text-[15px] leading-7 text-zinc-600 sm:grid-cols-[150px_minmax(0,1fr)]">
          <p className="font-semibold text-zinc-900">The short version</p>
          <p>When a conversion can run in your browser, it does. Browser-first conversions keep the original file on your device. For formats that require our local FFmpeg service, the file is used only to complete the conversion and is not used for advertising, profiling, or training.</p>
          <p className="font-semibold text-zinc-900">Files and conversions</p>
          <div className="space-y-5"><p>Image conversions happen directly in your browser using the file you select. Audio and video conversions may use a local FFmpeg-backed endpoint depending on the workflow and deployment. We do not permanently store uploaded media or converted results.</p><p>Temporary working files are removed after the conversion finishes or fails. You should still avoid uploading files that you are not authorized to process.</p></div>
          <p className="font-semibold text-zinc-900">Information we receive</p>
          <div className="space-y-5"><p>Mend Studio does not require an account. We may receive basic request information needed to operate the service, such as the selected output format and technical request logs. We do not sell personal information or use conversion content to build profiles.</p><p>If you contact the project team, we receive the information you choose to include in that message so we can respond.</p></div>
          <p className="font-semibold text-zinc-900">Third parties</p>
          <p>The service may run on hosting, analytics, or infrastructure providers that process limited technical information on our behalf. Those providers do not receive your media for independent use, and we do not add advertising trackers to the conversion experience.</p>
          <p className="font-semibold text-zinc-900">Your choices</p>
          <p>You can use browser privacy controls, clear local site data, or stop using the service at any time. Because we do not maintain user accounts or a media library, there is no profile to delete.</p>
        </div>
      </article>
    </div>
  );
}
