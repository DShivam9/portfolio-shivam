"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitTextReveal from "../ui/SplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

const WORKS = [
  {
    id: "01",
    title: "RetroRift",
    description: "High-performance retro console emulation running entirely in the browser.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
  },
  {
    id: "02",
    title: "SNIPCAST",
    description: "Privacy-first code snippet image generator running local client processing.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
  },
  {
    id: "03",
    title: "HEIC Studio",
    description: "Local drag-and-drop HEIC image conversion directly in the browser.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
  },
  {
    id: "04",
    title: "Campusly",
    description: "Decentralized school infrastructure orchestration with real-time mapping arrays.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    live: "#",
    github: "#",
  }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll(".project-row");
    rows.forEach((row) => {
      // Setup 3D perspective on the row itself
      gsap.set(row, { transformPerspective: 1500, transformStyle: "preserve-3d" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top bottom", // Starts when top of row hits bottom of viewport
          end: "bottom top",   // Ends when bottom of row hits top of viewport
          scrub: true,
        }
      });
      
      // Phase 1: Enter from bottom to center
      // z: -400 pushes it back into space. rotationX: -35 tilts top backward.
      tl.fromTo(row,
        { rotationX: -35, z: -400, opacity: 0.1, scale: 0.85, filter: "blur(12px) brightness(0.3) sepia(0.5)" },
        { rotationX: 0, z: 0, opacity: 1, scale: 1, filter: "blur(0px) brightness(1) sepia(0)", ease: "power1.inOut", duration: 0.5 },
        0 // starts at 0% of timeline
      );

      // Phase 2: Leave from center to top
      // z: -400 pushes it back. rotationX: 35 tilts bottom backward.
      tl.to(row,
        { rotationX: 35, z: -400, opacity: 0.1, scale: 0.85, filter: "blur(12px) brightness(0.3) sepia(0.5)", ease: "power1.inOut", duration: 0.5 },
        0.5 // starts exactly at 50% of the timeline (center of viewport)
      );

      // Keep the internal Image Parallax for extra depth
      const img = row.querySelector(".parallax-img");
      if (img) {
        tl.fromTo(img,
          { y: "-15%", scale: 1.15 },
          { y: "15%", scale: 1.15, ease: "none", duration: 1 },
          0
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-transparent text-white z-10"
      style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
    >
      <div
        className="relative z-10 flex flex-col"
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', gap: '15rem' }}
      >
        {WORKS.map((work, index) => {
          const isOdd = index % 2 !== 0;

          return (
            <div
              key={work.id}
              className={`project-row flex flex-col items-center gap-16 lg:gap-32 ${isOdd ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              style={{ willChange: "transform, opacity, filter" }}
            >
              {/* ── Image Card ── */}
              <div className="project-card w-full lg:w-[55%] shrink-0">
                <div className="relative w-full overflow-hidden group bg-[#0a0a0b] rounded-[10px]" style={{ aspectRatio: '16 / 10' }}>
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="parallax-img object-cover scale-[1.05] group-hover:scale-100 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] filter grayscale-[0.6] brightness-[0.6] contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100"
                  />
                  {/* Subtle editorial vignette, no magic glows */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-[800ms] group-hover:opacity-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
                  />
                  
                  {/* Anamorphic Letterbox - Top Bar */}
                  <div className="absolute top-0 left-0 w-full h-[12%] bg-[#030304] transform origin-top transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-y-0 z-10 pointer-events-none"></div>
                  
                  {/* Anamorphic Letterbox - Bottom Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-[12%] bg-[#030304] transform origin-bottom transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-y-0 z-10 pointer-events-none"></div>
                </div>
              </div>

              {/* ── Text Column ── */}
              <div
                className="flex flex-col justify-center"
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                <SplitTextReveal 
                  animation="scrub" 
                  type="words" 
                  className="font-serif italic uppercase [&_.word]:bg-gradient-to-r [&_.word]:from-accent [&_.word]:via-[#ffdf99] [&_.word]:to-accent [&_.word]:bg-clip-text [&_.word]:text-transparent" 
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '0.04em', lineHeight: 1.15, marginBottom: '1rem', paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
                >
                  {work.title}
                </SplitTextReveal>

                <SplitTextReveal animation="scrub" type="words" className="font-light text-white/40" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.05rem)', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2rem' }}>
                  {work.description}
                </SplitTextReveal>

                <div className="flex items-center gap-8 mt-4">
                  <a
                    href={work.live}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white/60 hover:text-accent transition-colors duration-300 pb-2"
                  >
                    <span>View Project</span>
                    <span className="w-4 h-[1px] bg-white/30 group-hover:bg-accent group-hover:w-8 transition-all duration-300"></span>
                  </a>
                  <a
                    href={work.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white/60 hover:text-accent transition-colors duration-300 pb-2"
                  >
                    <span>Source Code</span>
                    <span className="w-4 h-[1px] bg-white/30 group-hover:bg-accent group-hover:w-8 transition-all duration-300"></span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Projects — premium CTA */}
      <div
        className="flex justify-center"
        style={{ marginTop: '8rem', paddingBottom: '4rem' }}
      >
        <Link
          href="/projects"
          className="group relative flex items-center gap-8"
        >
          <span className="font-serif italic uppercase text-2xl md:text-4xl tracking-[0.2em] text-white/60 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:via-[#ffdf99] group-hover:to-accent transition-all duration-700 ease-out">
            All Projects
          </span>
          
          <div className="flex items-center">
            {/* Extremely long thin line that extends */}
            <div className="h-[1px] w-12 bg-white/30 group-hover:w-32 group-hover:bg-accent transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left"></div>
            {/* The arrow head */}
            <svg 
              className="w-6 h-6 text-white/30 group-hover:text-accent -ml-2 transition-colors duration-700"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
