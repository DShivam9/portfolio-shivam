"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import CustomCursor from "@/components/cursor/CustomCursor";
import SideRays from "@/components/ui/SideRays";

export default function ResumePage() {
  const glowRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle fade in for giant background typography
    gsap.fromTo(bgTextRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.03, scale: 1, duration: 3.5, ease: "power2.out" }
    );

    // Rotate the golden frame gradient
    gsap.to(frameRef.current, {
      rotation: 360,
      duration: 6,
      repeat: -1,
      ease: "linear"
    });

    // Make the spotlight pulse slowly
    gsap.to(glowRef.current, {
      opacity: 0.08,
      scale: 1.1,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#020202] text-white overflow-hidden flex flex-col cursor-none font-sans selection:bg-accent/30 perspective-[1000px]">
      <CustomCursor />
      
      {/* Cinematic Light Rays */}
      <SideRays 
        rayColor1="#ffdf99" 
        rayColor2="#4a3b1c" 
        intensity={2.5} 
        spread={2} 
        speed={1.5} 
        origin="top-right"
        className="opacity-40" 
      />

      {/* Real Film Grain Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-screen" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Massive Background Typography */}
      <h1 
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] text-center font-serif italic font-bold text-[18vw] leading-none text-white whitespace-nowrap pointer-events-none z-0 mix-blend-overlay select-none"
      >
        CURRICULUM VITAE
      </h1>

      {/* Ambient Spotlight */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[70vh] bg-accent rounded-full opacity-[0.05] blur-[120px] pointer-events-none mix-blend-screen z-0" 
      />

      {/* Editorial Navigation */}
      <div className="fixed top-8 w-full px-8 md:top-12 md:px-16 z-50 flex justify-between items-center pointer-events-none">
        <Link 
          href="/#contact"
          className="pointer-events-auto flex items-center gap-4 font-serif italic text-sm md:text-base tracking-[0.2em] text-white/60 hover:text-white transition-all duration-500 group uppercase"
          data-interactive="true"
        >
          <span className="w-8 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-16 transition-all duration-700 ease-out" />
          Return
        </Link>

        <a 
          href="/Shivam_Diwan_resume.pdf" 
          download="Shivam_Diwan_Resume.pdf"
          className="pointer-events-auto flex items-center gap-4 font-serif italic text-sm md:text-base tracking-[0.2em] text-accent/70 hover:text-accent transition-all duration-500 group uppercase"
          data-interactive="true"
        >
          Download
          <span className="w-8 h-[1px] bg-accent/30 group-hover:bg-accent group-hover:w-16 transition-all duration-700 ease-out" />
        </a>
      </div>

      {/* Museum Display Workspace */}
      <div className="relative z-10 flex-grow w-full px-6 md:px-12 pb-12 flex items-center justify-center">
        
        {/* The Static Physical Document Frame */}
        <div className="relative w-full md:w-[61.8vh] h-auto md:h-[80vh] aspect-[8.5/11]">
          
          {/* Animated Golden Frame Border */}
          <div className="absolute -inset-[2px] z-0 overflow-hidden shadow-[0_0_50px_rgba(255,170,64,0.15)] rounded-sm bg-[#1a1a1a]">
            <div 
              ref={frameRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(255,170,64,1)_100%)] opacity-80"
            />
          </div>

          {/* The Inner Document Container */}
          <div className="absolute inset-0 z-10 bg-[#050505] rounded-sm">
            {/* Glass Overlay to intercept custom cursor */}
            <div className="absolute inset-0 z-20 cursor-none" />

            {/* Elegant Loading State */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-0 bg-[#080808]">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase animate-pulse">
                RETRIEVING RECORD
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-pulse" />
            </div>

            {/* The PDF */}
            <iframe 
              ref={iframeRef}
              src="/Shivam_Diwan_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit" 
              className="w-full h-full border-none relative z-10 pointer-events-none transition-opacity duration-1000 rounded-sm"
              title="Shivam Diwan Resume"
              onLoad={() => {
                if (iframeRef.current) {
                  iframeRef.current.style.opacity = '1';
                }
              }}
              style={{ opacity: 0 }}
            />
          </div>
        </div>
        
      </div>
    </main>
  );
}
