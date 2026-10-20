import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { MotionPage } from "@/components/shared/motion-page";
import { ImmersiveHome } from "@/components/home/immersive-home";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#f59e0b]/45 via-orange-300/30 to-zinc-200/40 blur-3xl opacity-80" />
        <div className="absolute left-1/3 top-2/3 h-[300px] w-[500px] rounded-full bg-gradient-to-br from-zinc-200/50 via-amber-300/35 to-transparent blur-3xl opacity-80" />
      </div>
      <Navbar />
      <div className="relative z-10 overflow-visible">
        <MotionPage>
          <ImmersiveHome />
          <div className="mx-auto max-w-7xl px-6">
            <Footer />
          </div>
        </MotionPage>
      </div>
    </main>
  );
}
