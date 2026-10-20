import { VideoConverter } from "@/components/video/video-converter";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";

export default function VideoConvertPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-8 lg:px-10 lg:py-12">
        <PageHeader eyebrow="Video bench" title="Make the footage playable." description="Convert video for editing, sharing, archiving, or the next screen using the FFmpeg backend." />
        <section className="max-w-3xl"><VideoConverter /></section>
        <Footer />
      </div>
    </main>
  );
}
