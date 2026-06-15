"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code, X } from "lucide-react";
import gsap from "gsap";
import CustomCursor from "@/components/cursor/CustomCursor";
import Ferrofluid from "@/components/ui/Ferrofluid";

import { ALL_PROJECTS } from "@/constants/projects";

const FERROFLUID_COLORS = ['#E8A84A', '#78350f', '#000000'];

export default function ProjectsPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  // GSAP Mount Sequence (Page Transition)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsLoaded(true)
      });
      
      // Return button fade in
      tl.to("#return-btn", { opacity: 1, duration: 1, ease: "power2.out" }, 0.2);

      // Header text slide up
      tl.fromTo(".gsap-header-text", 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power4.out" },
        0.1
      );

      // Line drawing for borders
      tl.fromTo(".gsap-border",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, stagger: 0.1, ease: "power4.inOut" },
        "-=1.0"
      );

      // Text sliding up from hidden masks
      tl.fromTo(".gsap-text",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.04, ease: "power4.out" },
        "-=1.0" 
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Removed local Lenis setup - now using global LenisProvider



  return (
    <main ref={pageRef} className="relative w-full min-h-screen bg-black text-text-primary selection:bg-accent selection:text-black overflow-x-hidden pt-32 pb-40">
      
      {/* Cinematic Grain Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.15] mix-blend-soft-light w-full h-full" width="100%" height="100%">
        <filter id="cinematic-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
      </svg>

      {/* Ferrofluid Interactive Background */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Ferrofluid 
          colors={FERROFLUID_COLORS}
          speed={0.25}
          turbulence={1.5}
          glow={2.5}
          scale={1.2}
          mouseStrength={2.0}
          mouseRadius={0.5}
          dpr={0.75} // High-performance cap (reduces GPU load on 4k/Retina screens)
        />
      </div>

      {/* Close Button - Fixed to Top Right */}
      <Link 
        href="/"
        id="return-btn"
        className="fixed top-8 right-8 md:top-12 md:right-12 z-50 flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/50 hover:text-accent transition-colors w-fit group opacity-0 pointer-events-auto"
      >
        Close
        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
      </Link>

      <CustomCursor />



      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-24 overflow-hidden pt-4 -mt-4 pb-4 -mb-4">
          <h1 className="gsap-header-text opacity-0 font-serif text-6xl md:text-8xl lg:text-[10rem] text-white uppercase tracking-tighter leading-none opacity-90">
            Archive
          </h1>
        </div>

        {/* The Typographic Index */}
        <div className={`flex flex-col relative transition-all duration-300 ${isLoaded ? "pointer-events-auto" : "pointer-events-none"}`}>
          {/* Top border for the whole list */}
          <div className="gsap-border absolute top-0 left-0 w-full h-[1px] bg-white/20 origin-left scale-x-0" />

          {ALL_PROJECTS.map((project, idx) => (
            <div 
              key={project.id}
              className={`group relative flex items-center justify-between py-12 md:py-16 transition-all duration-700 cursor-default ${
                activeIdx !== null && activeIdx !== idx ? "opacity-15" : "opacity-100"
              }`}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {/* Bottom Border Mask */}
              <div className="gsap-border absolute bottom-0 left-0 w-full h-[1px] bg-white/20 origin-left scale-x-0 group-hover:bg-accent/50 transition-colors duration-500" />

              {/* Left: ID + Title */}
              <div className="flex items-center gap-8 md:gap-20 relative z-20 pointer-events-none">
                <div className="overflow-hidden">
                  <span className="gsap-text inline-block text-mono text-white/30 text-lg md:text-xl tracking-widest hidden md:block w-8 font-light transition-colors duration-500 group-hover:text-accent/50">
                    {project.id}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <h2 className="gsap-text inline-block font-serif text-5xl md:text-7xl lg:text-[6rem] text-white/60 group-hover:text-accent group-hover:translate-x-6 transition-all duration-700 ease-[0.16,1,0.3,1] uppercase tracking-tighter m-0 leading-none pb-2">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Center: Tech Stack */}
              <div className="hidden xl:flex flex-col gap-2 max-w-[200px] absolute left-[60%] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-700 ease-[0.16,1,0.3,1] pointer-events-none z-20">
                {project.tech.slice(0, 4).map((t, i) => (
                  <span key={i} className="text-[10px] font-mono tracking-widest text-accent uppercase opacity-70">
                    {t}
                  </span>
                ))}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-12 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700 ease-[0.16,1,0.3,1] relative z-20">
                <span className="text-mono text-accent text-sm tracking-widest uppercase hidden lg:block">
                  {project.category}
                </span>

                <div className="flex gap-4">
                  {project.github && project.github !== "#" && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-accent hover:border-accent hover:text-black transition-colors duration-300 pointer-events-auto"
                    >
                      <Code className="w-5 h-5" />
                    </a>
                  )}
                  {project.live && project.live !== "#" && (
                    <a 
                      href={project.live} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-accent hover:border-accent hover:text-black transition-colors duration-300 pointer-events-auto"
                    >
                      <ArrowUpRight className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
