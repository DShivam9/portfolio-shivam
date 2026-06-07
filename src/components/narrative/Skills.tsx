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
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const setProgress = useScrollStore((state) => state.setProgress);

  useGSAP(() => {
    if (!headingRef.current) return;

    // Track scroll progress
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
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

    // Cursor Tooltip Follower
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { xPercent: -50, yPercent: -100 });
      const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3.out" });
      const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3.out" });

      const moveCursor = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY - 20);
      };

      window.addEventListener("mousemove", moveCursor);
      return () => window.removeEventListener("mousemove", moveCursor);
    }
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
      style={{ paddingTop: '8vh', paddingBottom: '8vh', marginTop: '15vh' }}
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
        <div className="text-center w-full flex justify-center shrink-0" style={{ marginBottom: '16vh' }}>
          <h2
            ref={headingRef}
            className="text-[clamp(3.5rem,8vw,7rem)] text-text-primary tracking-tight leading-none drop-shadow-2xl text-center"
          >
            The Monolith of{' '}
            <span 
              className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent relative"
              style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
            >
              Craft
            </span>
          </h2>
        </div>

        {/* The Glyph Grid */}
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-20" style={{ gap: '10vh' }}>
          {ALL_GROUPS.map((group, groupIndex) => {
            const animationClass = groupIndex % 2 === 0 ? "animate-marquee" : "animate-marquee-rev";
            
            const renderGroupItems = (iteration: number) => (
              <>
                {group.map((tech) => {
                  const isHovered = hoveredTech?.id === tech.id;
                  const isFaded = hoveredTech !== null && !isHovered;

                  return (
                    <div
                      key={`${groupIndex}-${iteration}-${tech.id}`}
                      ref={addToRefs}
                      className={`
                        relative group cursor-none flex flex-col items-center justify-center shrink-0
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
                      <div className="h-[30px] min-h-[30px] md:h-[40px] md:min-h-[40px] flex items-center justify-center shrink-0">
                        <tech.IconComponent />
                      </div>
                    </div>
                  );
                })}
                {/* Zero-width spacer forces the flex container to render a trailing gap after the last tech */}
                <div className="w-0 shrink-0 pointer-events-none" aria-hidden="true" />
              </>
            );

            return (
              <div key={groupIndex} className="relative mx-auto flex justify-center w-max max-w-full">
                
                {/* 
                  1. THE GHOST SCAFFOLD
                  w-max forces it to tightly hug the original line of icons, defining the true pyramid shape.
                */}
                <div 
                  className="flex justify-center items-center gap-6 md:gap-10 w-max max-w-full mx-auto opacity-0 pointer-events-none" 
                  aria-hidden="true"
                >
                  {renderGroupItems(0)}
                </div>

                {/* 
                  2. THE MARQUEE
                  Absolutely positioned inside the tight ghost scaffold.
                */}
                <div 
                  className="absolute inset-0 flex flex-nowrap overflow-hidden w-full"
                  style={{ 
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                    maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
                  }}
                >
                  <div className={`flex flex-nowrap shrink-0 ${animationClass} items-center gap-6 md:gap-10`}>
                    {renderGroupItems(1)}
                  </div>
                  <div className={`flex flex-nowrap shrink-0 ${animationClass} items-center gap-6 md:gap-10`} aria-hidden="true">
                    {renderGroupItems(2)}
                  </div>
                  <div className={`flex flex-nowrap shrink-0 ${animationClass} items-center gap-6 md:gap-10`} aria-hidden="true">
                    {renderGroupItems(3)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Magnetic Cursor Tooltip */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[100] flex flex-col items-center justify-center transition-all duration-300 ease-out ${hoveredTech ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div 
          className="relative overflow-hidden rounded-[3px] px-8 py-6 flex flex-col items-center min-w-[240px] max-w-[340px]"
          style={{
            backgroundColor: '#0a0a0a',
            boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.04), inset 0 -4px 15px rgba(0, 0, 0, 1), 0 30px 60px -10px rgba(0, 0, 0, 1)',
            border: '1px solid rgba(255, 255, 255, 0.03)'
          }}
        >
          {/* Natural Stone Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.45] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
          
          {/* Inlaid Gold Title */}
          <h4 
            className="relative z-10 font-serif italic text-2xl md:text-3xl mb-1"
            style={{ 
              background: 'linear-gradient(to bottom, #ffdf99 0%, #c59b27 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.8))'
            }}
          >
            {hoveredTech?.name}
          </h4>

          {/* Engraved Divider */}
          <div 
            className="relative z-10 w-12 h-px my-4" 
            style={{ background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} 
          />
          
          {/* Engraved Letterpress Description */}
          <p 
            className="relative z-10 text-[#a0a0a0] text-[0.65rem] md:text-xs font-medium tracking-[0.25em] leading-relaxed text-center uppercase"
            style={{ textShadow: '0 -1px 1px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1)' }}
          >
            {hoveredTech?.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
