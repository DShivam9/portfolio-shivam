"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/utils/editorialNavigate";

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    registerLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
