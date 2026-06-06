"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CREATIVE_TECH, CORE_ENGINEERING, SYSTEMS_DEVOPS, INTELLIGENT_AGENTS, TechItem } from '@/constants/skillsData';
import { useScrollStore } from '@/store/scrollStore';

gsap.registerPlugin(ScrollTrigger);

const ALL_GROUPS = [
  CREATIVE_TECH,
  CORE_ENGINEERING,
  SYSTEMS_DEVOPS,
  INTELLIGENT_AGENTS
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const glyphsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const setProgress = useScrollStore((state) => state.setProgress);

  useGSAP(() => {
    if (!headingRef.current) return;

    // Track scroll progress and PIN the section so the bird flight is scroll-dependent
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "center center", // Pin when the section is perfectly centered on screen
      end: "+=4000", // Massively increased scroll distance to make the flight very slow and deliberate
      pin: true, // Lock the section in place
      pinSpacing: true, // Push the next section down by 1500px
      onUpdate: (self) => setProgress("skills", self.progress),
    });

    // Heading animation
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40, filter: "blur(12px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)",
        ease: "power3.out", duration: 1.6,
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
      }
    );

    // Glyphs staggered entrance
    gsap.fromTo(glyphsRef.current,
      { opacity: 0, scale: 0.5, filter: "blur(10px)", y: 20 },
      {
        opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
        duration: 1.2,
        stagger: 0.03,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%"
        }
      }
    );
  }, { scope: containerRef });

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !glyphsRef.current.includes(el)) {
      glyphsRef.current.push(el);
    }
  };



  return (
    <section
      ref={containerRef}
      className="relative w-full z-10 overflow-hidden flex flex-col items-center justify-center bg-transparent"
      style={{ paddingTop: '15vh', paddingBottom: '15vh', marginTop: '10vh' }}
    >
      {/* ── Atmosphere ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(100,140,200,0.02) 0%, transparent 80%)
          `,
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-[5] w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
        
        {/* Massive Heading */}
        <div className="text-center w-full flex justify-center mb-16 md:mb-20 shrink-0">
          <h2
            ref={headingRef}
            className="text-[clamp(3.5rem,8vw,7rem)] text-text-primary tracking-tight leading-none drop-shadow-2xl text-center"
          >
            The Monolith of{' '}
            <span 
              className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent"
              style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
            >
              Craft
            </span>
          </h2>
        </div>

        {/* The Reader Area */}
        <div className="w-full max-w-[600px] h-[160px] md:h-[180px] mx-auto relative flex flex-col items-center justify-center text-center mb-16 md:mb-20">
          
          {/* Default State */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out ${hoveredTech ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-40 scale-100'}`}>
            <span className="font-serif italic text-2xl md:text-3xl text-white tracking-widest mb-4 text-center">
              Awaiting Interaction
            </span>
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/50 text-center">
              Focus on an artifact
            </span>
          </div>

          {/* Hover State (Active Tech) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out ${hoveredTech ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
            <h3 className="font-serif italic text-3xl md:text-5xl text-accent tracking-wide mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] text-center">
              {hoveredTech?.name}
            </h3>
            <p className="text-text-secondary text-sm md:text-base font-light tracking-wide leading-relaxed text-center max-w-[80%] mx-auto">
              {hoveredTech?.desc}
            </p>
          </div>

        </div>

        {/* The Glyph Grid */}
        <div className="flex flex-col gap-10 md:gap-14 items-center justify-center w-full max-w-5xl mx-auto z-20">
          {ALL_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-wrap justify-center items-center gap-6 md:gap-10 w-full mx-auto">
              {group.map((tech) => {
                const isHovered = hoveredTech?.id === tech.id;
                const isFaded = hoveredTech !== null && !isHovered;

                return (
                  <div
                    key={tech.id}
                    ref={addToRefs}
                    className={`
                      relative group cursor-none flex flex-col items-center justify-center
                      transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                      p-3 md:p-5 rounded-xl md:rounded-2xl
                      ${isHovered ? "scale-110 z-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" : ""}
                      ${isFaded ? "opacity-30 scale-95 blur-[2px]" : ""}
                      ${hoveredTech === null ? "hover:scale-105" : ""}
                    `}
                    onMouseEnter={() => setHoveredTech(tech)}
                    onMouseLeave={() => setHoveredTech(null)}
                    data-interactive="true"
                    data-cursor-type="focus"
                  >
                    {/* The Icon Container */}
                    <div className="h-[30px] min-h-[30px] md:h-[40px] md:min-h-[40px] flex items-center justify-center shrink-0">
                      <tech.IconComponent />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
