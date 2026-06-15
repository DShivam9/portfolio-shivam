"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitTextReveal from "../ui/SplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

import { HOME_PROJECTS as WORKS } from "@/constants/projects";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll(".project-row");
    rows.forEach((row, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      // High-end cinematic fade-in (no Z-snap/spiral)
      tl.fromTo(row,
        { opacity: 0, y: 80, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", ease: "power3.out", duration: 1.5 },
        0
      );

      // Shutter Effect
      const boxTop = row.querySelector(".letterbox-top");
      const boxBottom = row.querySelector(".letterbox-bottom");
      if (boxTop && boxBottom) {
        tl.fromTo([boxTop, boxBottom],
          { scaleY: 1 },
          { scaleY: 0, ease: "power3.inOut", duration: 1.5 },
          0.1
        );
      }

      // Image subtle scale down
      const img = row.querySelector(".parallax-img");
      if (img) {
        tl.fromTo(img,
          { scale: 1.15 },
          { scale: 1, ease: "power3.out", duration: 2 },
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
      style={{ paddingTop: '10rem', paddingBottom: '10rem' }}
    >
      <div
        className="relative z-10 flex flex-col"
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', gap: '20rem' }}
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
              <div className="w-full lg:w-[55%] shrink-0">
                <div className="relative w-full overflow-hidden group rounded-[8px] bg-[#030304]" style={{ aspectRatio: '16 / 10' }}>
                  
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="parallax-img object-cover filter grayscale-[0.4] brightness-[0.7] contrast-[1.05] group-hover:grayscale-[0.1] group-hover:brightness-[0.9] group-hover:contrast-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  
                  {/* Subtle editorial vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000 group-hover:opacity-70"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }}
                  />
                  
                  {/* Anamorphic Letterbox Shutter */}
                  <div className="letterbox-top absolute top-0 left-0 w-full h-[15%] bg-[#030304] transform origin-top z-10 pointer-events-none"></div>
                  <div className="letterbox-bottom absolute bottom-0 left-0 w-full h-[15%] bg-[#030304] transform origin-bottom z-10 pointer-events-none"></div>
                </div>
              </div>

              {/* ── Text Column ── */}
              <div
                className="flex flex-col justify-center"
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                <SplitTextReveal 
                  animation="curtain" 
                  type="words" 
                  className="font-serif italic uppercase [&_.word]:bg-gradient-to-r [&_.word]:from-accent [&_.word]:via-[#ffdf99] [&_.word]:to-accent [&_.word]:bg-clip-text [&_.word]:text-transparent" 
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '0.04em', lineHeight: 1.15, marginBottom: '1rem', paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
                >
                  {work.title}
                </SplitTextReveal>

                <SplitTextReveal animation="curtain" type="lines" className="font-light text-white/50" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.05rem)', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2.5rem' }}>
                  {work.description}
                </SplitTextReveal>

                <div className="flex items-center gap-8 mt-2">
                  {work.live && work.live !== "#" && (
                    <a
                      href={work.live}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors duration-500 py-3"
                    >
                      <span>View Project</span>
                      <span className="w-4 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-8 transition-all duration-500 ease-out"></span>
                    </a>
                  )}

                  {work.github && work.github !== "#" && (
                    <a
                      href={work.github}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors duration-500 py-3"
                    >
                      <span>Source Code</span>
                      <span className="w-4 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-8 transition-all duration-500 ease-out"></span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Projects — premium CTA */}
      <div
        className="flex justify-center"
        style={{ marginTop: '12rem', paddingBottom: '4rem' }}
      >
        <Link
          href="/projects"
          className="group relative flex items-center gap-8 py-4 px-6"
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
