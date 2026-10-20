import { AudioConverter } from "@/components/audio/audio-converter";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";

export default function AudioConvertPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 py-8 lg:px-10 lg:py-12">
        <PageHeader eyebrow="Audio bench" title="Put the track in the right container." description="Convert audio through the FFmpeg backend and download a clean result without creating an account." />
        <section className="max-w-3xl"><AudioConverter /></section>
        <Footer />
      </div>
    </main>
  );
}
