"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code, X } from "lucide-react";
import gsap from "gsap";
import Lenis from "lenis";
import CustomCursor from "@/components/cursor/CustomCursor";
import Ferrofluid from "@/components/ui/Ferrofluid";

const ALL_PROJECTS = [
  {
    id: "01",
    title: "Campusly",
    description: "A scalable PERN stack campus management platform serving 4 distinct user roles. Features real-time GPS bus tracking and RBAC.",
    tech: ["PostgreSQL", "Express", "React", "Node.js", "PostGIS", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    video: "", 
    live: "#",
    github: "#",
    category: "Full Stack"
  },
  {
    id: "02",
    title: "RetroRift",
    description: "A browser-based platform to play classic retro games. Cinematic arcade-inspired UI built with WebGL and WebAssembly.",
    tech: ["React", "Vite", "WebGL", "WebAssembly", "Tailwind CSS"],
    image: "/projects/retrorift.png",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
    category: "Web App"
  },
  {
    id: "03",
    title: "SNIPCAST",
    description: "Generate beautiful, share-ready images from your code snippets in seconds. Developer-first interface with Next.js 14.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/snipcast.png",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
    category: "Tool"
  },
  {
    id: "04",
    title: "HEIC Studio",
    description: "Drag-and-drop tool to convert iPhone HEIC photos to JPG/PNG instantly. Client-side processing for privacy.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/heicstudio.png",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
    category: "Tool"
  },
  {
    id: "05",
    title: "WeatherEye",
    description: "Real-time weather app with dynamic themes, dark mode, and animated visuals.",
    tech: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065&auto=format&fit=crop",
    live: "https://dshivam9.github.io/WeatherEye/",
    github: "https://github.com/DShivam9/WeatherEye",
    category: "Web App"
  },
  {
    id: "06",
    title: "OSCORP",
    description: "Stunning 3D landing page with smooth motion interactions and scroll-driven cinematic experience.",
    tech: ["HTML", "CSS", "JavaScript", "Spline 3D"],
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop",
    live: "https://dshivam9.github.io/Immersive-Landing-Page/",
    github: "https://github.com/DShivam9/Immersive-Landing-Page",
    category: "3D Web"
  }
];

const FERROFLUID_COLORS = ['#E8A84A', '#78350f', '#000000'];

export default function ProjectsPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
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

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      lerp: 0.08,
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Floating Image Tracker
  useEffect(() => {
    if (!imageContainerRef.current) return;

    const xTo = gsap.quickTo(imageContainerRef.current, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(imageContainerRef.current, "y", { duration: 0.4, ease: "power3" });

    const moveImage = (e: MouseEvent) => {
      // Offset by half the image size (384x256) to perfectly center the image on the cursor
      xTo(e.clientX - 192);
      yTo(e.clientY - 128);
    };

    window.addEventListener("mousemove", moveImage);
    return () => window.removeEventListener("mousemove", moveImage);
  }, []);

  // Floating Image State Changes
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    if (activeIdx !== null) {
      gsap.to(imageContainerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });
    } else {
      gsap.to(imageContainerRef.current, {
        scale: 0.4,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        overwrite: "auto"
      });
    }
  }, [activeIdx]);

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

      {/* Floating Image Reveal (Cursor Bound) */}
      <div 
        ref={imageContainerRef}
        className="fixed top-0 left-0 w-[384px] aspect-video pointer-events-none z-0 opacity-0 scale-50 overflow-hidden"
      >
        {ALL_PROJECTS.map((p, i) => (
          <div 
            key={p.id} 
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: activeIdx === i ? 1 : 0 }}
          >
            <Image
              src={p.image}
              alt={p.title}
              fill
              className="object-cover grayscale-[20%]"
              sizes="384px"
              priority
            />
            {/* Cinematic dark wash over the image */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          </div>
        ))}
      </div>

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
