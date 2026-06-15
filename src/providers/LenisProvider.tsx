"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ultimate fix for GSAP Pinning + Scroll Restoration jumping
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      // This is the specific GSAP command to stop it from remembering 
      // the scroll position and applying it after pin calculations
      ScrollTrigger.clearScrollMemory("manual");
      
      // Force top BEFORE Lenis or GSAP even load if no hash
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    // Force scroll to top on unload 
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.5,
      touchMultiplier: 1.5,
      lerp: 0.04,
    });

    (window as any).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Wait for GSAP and layout to settle, then refresh triggers and handle hashes
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
      
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
        }
      } else {
        // If no hash, explicitly ensure we are at the top on a fresh load
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      window.onbeforeunload = null;
      gsap.ticker.remove(updateLenis);
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
