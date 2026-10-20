import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { MotionPage } from "@/components/shared/motion-page";
import { ImmersiveHome } from "@/components/home/immersive-home";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">
      <Navbar />
      <MotionPage>
        <ImmersiveHome />
        <div className="mx-auto max-w-6xl px-6">
          <Footer />
        </div>
      </MotionPage>
    </main>
  );
}
