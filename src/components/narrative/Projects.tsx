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
    title: "Campusly",
    description: "Decentralized school infrastructure orchestration with real-time mapping arrays.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: "02",
    title: "RetroRift",
    description: "High-performance retro console emulation running entirely in the browser.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
  },
  {
    id: "03",
    title: "SNIPCAST",
    description: "Privacy-first code snippet image generator running local client processing.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
  },
  {
    id: "04",
    title: "HEIC Studio",
    description: "Local drag-and-drop HEIC image conversion directly in the browser.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
  }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll(".project-row");
    rows.forEach((row) => {
      const card = row.querySelector(".project-card");
      if (!card) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 95%",
          end: "bottom 20%",
          scrub: true,
        }
      });
      
      // Continuous Y movement over the entire scrub
      tl.fromTo(card, 
        { y: 80 }, 
        { y: -30, ease: "none", duration: 1 }, 
        0
      );
      
      // Fast fade/blur that finishes in the first 35% of the scroll
      tl.fromTo(card,
        { opacity: 0, filter: "blur(12px)" },
        { opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.35 },
        0
      );
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
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', gap: '10rem' }}
      >
        {WORKS.map((work, index) => {
          const isOdd = index % 2 !== 0;

          return (
            <div
              key={work.id}
              className={`project-row flex flex-col items-center gap-16 lg:gap-32 ${isOdd ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
            >
              {/* ── Image Card ── */}
              <div
                className="project-card w-full lg:w-[55%] shrink-0 opacity-0"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                <div className="relative w-full overflow-hidden group bg-[#0a0a0b] rounded-[10px]" style={{ aspectRatio: '16 / 10' }}>
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 filter grayscale-[0.6] brightness-[0.6] contrast-125 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100"
                  />
                  {/* Subtle editorial vignette, no magic glows */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-[800ms] group-hover:opacity-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
                  />
                </div>
              </div>

              {/* ── Text Column ── */}
              <div
                className="flex flex-col justify-center"
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                <SplitTextReveal animation="scrub" type="words" className="font-serif font-light uppercase text-white/90" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '0.04em', lineHeight: 1.15, marginBottom: '1rem' }}>
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
        style={{ marginTop: '8rem', paddingBottom: '2rem' }}
      >
        <Link
          href="/projects"
          className="group flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-6 text-white/80 group-hover:text-accent transition-colors duration-700">
            <span className="text-sm md:text-base font-mono tracking-[0.3em] uppercase">
              All Projects
            </span>
            <svg 
              className="w-5 h-5 -translate-x-2 opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          {/* Majestic underline */}
          <div className="w-12 h-[1px] bg-white/20 group-hover:w-full group-hover:bg-accent transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
        </Link>
      </div>
    </section>
  );
}
