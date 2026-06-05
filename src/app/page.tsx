"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/narrative/Hero";
import Gateway from "@/components/narrative/Gateway";
import About from "@/components/narrative/About";
import Projects from "@/components/narrative/Projects";
import GatewayProjects from "@/components/narrative/GatewayProjects";
import GatewaySkills from "@/components/narrative/GatewaySkills";
import Skills from "@/components/narrative/Skills";
import Contact from "@/components/narrative/Contact";
import CustomCursor from "@/components/cursor/CustomCursor";

const SceneCanvas = dynamic(() => import("@/components/3d/SceneCanvas"), { ssr: false });
const SplashCursor = dynamic(() => import("@/components/cursor/SplashCursor"), { ssr: false });
const GlobalEnvironment = dynamic(() => import("@/components/ui/GlobalEnvironment"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  
  useEffect(() => {
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

    // ── Critical: Sync Lenis with GSAP ScrollTrigger ──
    // Lenis reports its smooth interpolated scroll position to ScrollTrigger
    // on every scroll event, so scrub-driven timelines stay perfectly in sync.
    lenis.on("scroll", ScrollTrigger.update);

    // ── Drive Lenis from GSAP's ticker (single RAF loop) ──
    // Using GSAP's ticker instead of a raw requestAnimationFrame ensures
    // both animation systems share the exact same frame timing.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's lag smoothing to prevent conflicts with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base">
      <CustomCursor />
      <SplashCursor />
      <Navbar />
      
      {/* GLOBAL ATMOSPHERE LAYER (Interactive Framer Motion) */}
      <GlobalEnvironment />
      
      {/* 3D LAYER - FIXED IN BACKGROUND */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <SceneCanvas />
      </div>

      {/* DOM CONTENT LAYER */}
      <div className="relative z-10 flex flex-col w-full mx-auto">
        <Hero />
        <Gateway />
        <About />
        <Skills />
        <GatewayProjects />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
