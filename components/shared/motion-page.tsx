import { ReactNode } from "react";

export function MotionPage({ children }: { children: ReactNode }) {
  return <div className="overflow-visible motion-safe:animate-page-enter">{children}</div>;
}
