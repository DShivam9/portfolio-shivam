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
      virtualScroll: ({ event, deltaY }) => {
        if (!(event.target instanceof Element)) return true;
        const box = event.target.closest<HTMLElement>("[data-scroll-handoff]");
        if (!box) return true;
        const atTop = box.scrollTop <= 0;
        const atBottom =
          box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
        // Let Lenis scroll the page once inner box hits top/bottom edge
        return (deltaY < 0 && atTop) || (deltaY > 0 && atBottom);
      },
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
