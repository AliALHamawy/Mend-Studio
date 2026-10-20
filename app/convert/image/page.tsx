import { ImageConverter } from "@/components/images/image-converter";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import { MotionPage } from "@/components/shared/motion-page";

export default function ImageConvertPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">
      <Navbar />
      <MotionPage><div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-8 lg:px-10 lg:py-12">
        <PageHeader eyebrow="Image bench" title="Give your image a new shape." description="Switch formats and tune compression in your browser. Your original file never leaves this page." />
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <ImageConverter />
          <aside className="flex flex-col gap-5 border-l border-border pl-6 text-sm text-muted-foreground">
            <p>Best for</p>
            <p>Web images, social exports, email attachments, and quick format changes.</p>
            <p>Supported output</p>
            <p>JPG, PNG, WebP, and AVIF.</p>
          </aside>
        </section>
        <Footer />
      </div></MotionPage>
    </main>
  );
}
