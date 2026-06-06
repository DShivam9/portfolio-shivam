"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RuneDivider from "../ui/RuneDivider";
import { useScrollStore } from "@/store/scrollStore";
import SplitTextReveal from "../ui/SplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const setProgress = useScrollStore((state) => state.setProgress);
  
  useGSAP(() => {
    if (!containerRef.current) return;

    // ── Report scroll progress for 3D lighting system ──
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => setProgress("about", self.progress),
    });

    // ── Cinematic Float for Entire Cards (No Cropping) ──
    const cards = containerRef.current.querySelectorAll(".photo-card-container");
    cards.forEach((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
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

    // ── Simple fade for RuneDivider ──
    const dividers = containerRef.current.querySelectorAll(".rune-divider-block");
    dividers.forEach((block) => {
      gsap.fromTo(block,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

  }, { scope: containerRef, dependencies: [setProgress] });

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full bg-transparent text-white z-10 pt-32 pb-48 md:pt-48 md:pb-64"
    >
      <div className="relative z-10 flex flex-col gap-32 md:gap-48" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* ── Para 1 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0">
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-2xl md:text-3xl leading-relaxed max-w-2xl">
              I am a digital engineer bound to the creation of highly immersive, performant web experiences. By stripping away standard constraints, I seek to elevate the web from a mere document to an ethereal experience.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[320px] md:max-w-[400px]">
            <div className="photo-card-container relative w-full rounded-xl bg-[#020202]">
              <img 
                src="/about/trip_photo_1.jpeg" 
                alt="Shivam Diwan" 
                className="w-full h-auto block rounded-xl relative z-10"
              />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* ── Para 2 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0 flex flex-col items-start md:items-end text-left md:text-right">
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-2xl md:text-3xl leading-relaxed max-w-2xl">
              My journey began with a deep fascination for 3D realms and interactive mythos. Over the years, I have honed the craft of bridging rigorous technical architecture with boundary-pushing, magical design.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[440px] md:max-w-[500px]">
            <div className="photo-card-container relative w-full rounded-xl bg-[#020202]">
              <img 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM.jpeg" 
                alt="Craft" 
                className="w-full h-auto block rounded-xl relative z-10"
              />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* ── Rune Divider ── */}
        <div className="rune-divider-block self-center py-12 opacity-0">
          <div className="bg-bg-base/80 backdrop-blur-sm rounded-full border border-accent/20 px-8 py-2">
            <RuneDivider />
          </div>
        </div>

        {/* ── Para 3 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0">
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-2xl md:text-3xl leading-relaxed max-w-2xl">
              Whether orchestrating complex physics in WebGL or ensuring an application scales flawlessly, my approach is rooted in absolute precision. I believe that true digital elegance emerges only from a deep understanding of the underlying arcane systems.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[460px] md:max-w-[500px]">
            <div className="photo-card-container relative w-full rounded-xl bg-[#020202]">
              <img 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (1).jpeg" 
                alt="Method" 
                className="w-full h-auto block rounded-xl relative z-10"
              />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* ── Para 4 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0 flex flex-col items-start md:items-end text-left md:text-right">
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-2xl md:text-3xl leading-relaxed max-w-2xl">
              Currently, I am exploring the intersection of spatial computing and the open web, forging interfaces that feel intuitive, human, and alive.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[350px] md:max-w-[400px]">
            <div className="photo-card-container relative w-full rounded-xl bg-[#020202]">
              <img 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (2).jpeg" 
                alt="Vision" 
                className="w-full h-auto block rounded-xl relative z-10"
              />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
