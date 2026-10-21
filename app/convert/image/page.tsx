import { ImageConverter } from "@/components/images/image-converter";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { MotionPage } from "@/components/shared/motion-page";
import type { Metadata } from "next";
import { CheckCircle2Icon, FileImageIcon, ShieldCheckIcon } from "lucide-react";

export function generateMetadata(): Metadata {
  return {
    title: "Image Converter | Mend Studio",
    description: "Convert JPG, PNG, WebP, and AVIF images with smart compression directly in your browser.",
  };
}

export default function ImageConvertPage() {
  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 size-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-rose-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] rounded-full bg-gradient-to-br from-orange-400/15 via-amber-200/20 to-transparent blur-3xl" />
      </div>
      <Navbar />
      <MotionPage><div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-28 sm:gap-12 sm:px-6 lg:px-10 lg:py-32">
        <PageHeader eyebrow="Image bench" title="Give your image a new shape." description="Switch formats and tune compression in your browser. Your original file never leaves this page." />
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <ImageConverter />
          <aside className="flex flex-col gap-5 rounded-3xl border border-white/90 bg-white/60 p-8 text-sm text-muted-foreground shadow-[0_20px_50px_rgba(0,0,0,0.06),_0_10px_20px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl max-md:p-5 lg:border-l lg:pl-6">
            <div className="flex items-center gap-2 text-amber-700"><FileImageIcon className="size-4" /><p className="font-semibold">Best for</p></div>
            <p className="rounded-2xl bg-amber-400/10 p-4 text-zinc-700">Web images, social exports, email attachments, and quick format changes.</p>
            <div className="flex items-center gap-2 text-amber-700"><CheckCircle2Icon className="size-4" /><p className="font-semibold">Supported output</p></div>
            <div className="flex flex-wrap gap-2">{["JPG", "PNG", "WebP", "AVIF"].map((format) => <span key={format} className="rounded-full border border-amber-300/60 bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-800">{format}</span>)}</div>
            <div className="mt-auto flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-xs text-zinc-600"><ShieldCheckIcon className="size-4 text-emerald-600" /> Browser-first processing</div>
          </aside>
        </section>
        <Footer />
      </div></MotionPage>
    </main>
  );
}
