"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useScrollStore } from "@/store/scrollStore";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const setProgress = useScrollStore(state => state.setProgress);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !wrapperRef.current) return;

    // ---- CINEMATIC HERO ENTRANCE ----
    const entranceTl = gsap.timeline({ delay: 0.1 });

    // Phase 0: Subtitle — elegant upward fade with subtle tracking expansion
    entranceTl.fromTo(".hero-subtitle", 
      { opacity: 0, y: 15, filter: "blur(4px)", letterSpacing: "0.2em" },
      { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.4em", duration: 1.8, ease: "expo.out", clearProps: "filter" }
    );

    // Phase 1: "Crafting" — deep, slow sweep up with cinematic blur
    entranceTl.fromTo(".hero-char-1",
      { filter: "blur(12px)" },
      { 
        filter: "blur(0px)",
        duration: 0.8, 
        stagger: { each: 0.06, from: "start" },
        ease: "power2.out",
        clearProps: "filter"
      },
      "-=1.4"
    );
    entranceTl.fromTo(".hero-char-1",
      { y: 120, opacity: 0, rotationX: -80, transformOrigin: "bottom" },
      { 
        y: 0, opacity: 1, rotationX: 0,
        duration: 2.0, 
        stagger: { each: 0.06, from: "start" },
        ease: "expo.out",
      },
      "<" 
    );

    // Phase 2: "Experiences." — ultra-smooth editorial reveal
    entranceTl.fromTo(".hero-char-2",
      { filter: "blur(12px)" },
      { 
        filter: "blur(0px)",
        duration: 0.8,
        stagger: { each: 0.06, from: "start" },
        ease: "power2.out",
        clearProps: "filter"
      },
      "-=1.6"
    );
    entranceTl.fromTo(".hero-char-2",
      { y: 100, opacity: 0, rotationX: -50, transformOrigin: "bottom" },
      { 
        y: 0, opacity: 1, rotationX: 0,
        duration: 2.2,
        stagger: { each: 0.06, from: "start" },
        ease: "expo.out",
      },
      "<" 
    );

    // Phase 3: Ethereal glow on "Experiences." — slower breathing
    gsap.to(".hero-char-2", {
      textShadow: "0 0 40px rgba(232, 168, 74, 0.5)",
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.1, from: "start", repeat: -1, yoyo: true },
      ease: "sine.inOut",
      delay: 1.5
    });

    // ---- SCROLL INDICATOR ANIMATIONS ----
    // Elegant vertical line segment gliding loop
    gsap.fromTo(".scroll-spark",
      { y: -24, opacity: 0 },
      { 
        y: 56, 
        opacity: 1, 
        duration: 2.2, 
        repeat: -1, 
        ease: "power2.inOut",
        keyframes: [
          { opacity: 1, offset: 0.3 },
          { opacity: 1, offset: 0.7 },
          { opacity: 0, offset: 1.0 }
        ]
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Silky smooth scrub
        onUpdate: (self) => setProgress("hero", self.progress)
      }
    });

    // Split the paragraph for word-by-word blur scrub
    const paraSplit = new SplitType(".hero-desc-para", { types: "words" });

    // Phase 1: Scrub Set 1 out (Word by Word)
    tl.to(".word-out", {
      opacity: 0,
      filter: "blur(12px)",
      y: -60,
      rotationX: 45,
      scale: 0.9,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut"
    }, 0);

    // Phase 2: Scrub Set 2 in (Word by Word)
    tl.fromTo(".word-in", {
      opacity: 0,
      filter: "blur(12px)",
      y: 60,
      rotationX: -45,
      scale: 1.1,
    }, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      rotationX: 0,
      scale: 1,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    }, 0.4);

    // Phase 3: Reveal Secondary Elements (Paragraph words, Button, Socials)
    tl.fromTo(paraSplit.words, {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    }, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      stagger: 0.04,
      duration: 1,
      ease: "power3.out"
    }, 0.8);

    tl.fromTo(".reveal-on-scroll", {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    }, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out"
    }, 0.8);

    // Fade out scroll indicator early
    tl.to(".scroll-indicator", {
      opacity: 0,
      duration: 0.3
    }, 0);

    // Phase 4: Clean fade out of all Hero elements at the bottom of the scrub to clear the viewport for Chapter 2
    tl.to([".word-in", paraSplit.words, ".reveal-on-scroll"], {
      opacity: 0,
      filter: "blur(10px)",
      y: -40,
      duration: 0.8,
      stagger: 0.01,
      ease: "power2.in"
    }, 1.8);

    return () => {
      entranceTl.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      paraSplit.revert();
    };
  }, [setProgress]);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative w-full h-[300vh]"
    >
      <div ref={wrapperRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* INVISIBLE ANCHOR FOR 3D MODEL TRACKING */}
        <div id="bird-anchor" className="absolute top-[45%] left-1/2 -translate-x-1/2 w-4 h-4 pointer-events-none" />

        {/* SINGLE TEXT CONTAINER FOR PERFECT CENTERING */}
        <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto pointer-events-none mix-blend-difference z-10 pt-10">
          
          {/* GRID OVERLAY FOR PERFECT TEXT ALIGNMENT AND HEIGHT CALCULATION */}
          <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full [perspective:1000px]">
            
            {/* TEXT SET 1 */}
            <div className="col-start-1 row-start-1 flex flex-col items-center justify-center z-10">
              <div className="word-out text-mono text-white/90 mb-6 tracking-[0.4em] uppercase text-xs md:text-sm font-semibold drop-shadow-lg pl-[0.4em]">
                <span className="hero-subtitle inline-block">Shivam Diwan — Full Stack & Frontend Developer</span>
              </div>
              <h1 className="text-hero text-text-primary tracking-tight leading-[1.05]">
                <span className="word-out inline-block mr-4">
                  {"Crafting".split("").map((ch, i) => (
                    <span key={i} className="hero-char-1 inline-block" style={{ willChange: 'transform, opacity, filter' }}>
                      {ch}
                    </span>
                  ))}
                </span><br />
                <span className="word-out inline-block font-serif italic text-[#ffdf99] drop-shadow-sm" style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}>
                  {"Experiences.".split("").map((ch, i) => (
                    <span key={i} className="hero-char-2 inline-block" style={{ willChange: 'transform, opacity, filter' }}>
                      {ch}
                    </span>
                  ))}
                </span>
              </h1>
            </div>

            {/* TEXT SET 2 */}
            <div className="col-start-1 row-start-1 flex flex-col items-center justify-center z-20">
              <div className="word-in text-mono text-white/90 mb-6 tracking-[0.4em] uppercase text-xs md:text-sm font-semibold drop-shadow-lg opacity-0 pl-[0.4em]">
                Where Structure Meets Ethereal Design
              </div>
              <h1 className="text-hero text-text-primary tracking-tight leading-[1.05]">
                <span className="word-in inline-block opacity-0 mr-6">Awakening</span><br />
                <span className="word-in inline-block opacity-0 mr-4">Digital</span>
                <span className="word-in inline-block font-serif italic opacity-0 text-[#ffdf99] drop-shadow-sm" style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}>Worlds.</span>
              </h1>
            </div>

          </div>
        </div>

        {/* BOTTOM ANCHORED ELEMENTS - Absolutely positioned at the bottom of the screen to permanently prevent overlap */}
        <div className="absolute bottom-8 md:bottom-10 w-full px-6 flex flex-col items-center justify-center z-30 pointer-events-none">
          <div className="max-w-2xl mx-auto text-center mix-blend-difference">
            <p className="hero-desc-para text-body text-text-secondary font-light leading-relaxed mb-10 text-sm md:text-base">
              A deep exploration into <span className="text-[#ffdf99] font-medium">immersive 3D</span> web environments. By stripping away standard constraints, we elevate the web from a document to an <span className="text-[#ffdf99] font-medium">experience</span>.
            </p>
          </div>

          {/* Minimalist Premium Scroll Indicator */}
          <div className="scroll-indicator flex flex-col items-center mix-blend-difference pointer-events-none select-none">
            <span className="text-white/30 text-[8px] font-mono uppercase tracking-[0.4em] mb-3">
              Scroll
            </span>
            <div className="w-[1px] h-14 bg-white/10 relative overflow-hidden">
              <div className="scroll-spark absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white/60 to-transparent opacity-0" />
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS - Pinned to sides */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-12 flex flex-col gap-8 text-[10px] tracking-[0.3em] uppercase text-text-secondary font-light mix-blend-difference pointer-events-auto z-20">
          <a href="/resume" className="reveal-on-scroll opacity-0 hover:text-accent transition-colors cursor-none [writing-mode:vertical-rl] rotate-180" data-interactive="true" data-cursor-type="social">Resume</a>
          <a href="https://www.linkedin.com/in/shivam-diwan-84a1b9342/" target="_blank" rel="noreferrer noopener" className="reveal-on-scroll opacity-0 hover:text-accent transition-colors cursor-none [writing-mode:vertical-rl] rotate-180" data-interactive="true" data-cursor-type="social">LinkedIn</a>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-12 flex flex-col gap-8 text-[10px] tracking-[0.3em] uppercase text-text-secondary font-light mix-blend-difference pointer-events-auto z-20">
          <a href="https://github.com/DShivam9" target="_blank" rel="noreferrer noopener" className="reveal-on-scroll opacity-0 hover:text-accent transition-colors cursor-none [writing-mode:vertical-rl]" data-interactive="true" data-cursor-type="social">GitHub</a>
          <a href="mailto:shivamdiwan1500@gmail.com" className="reveal-on-scroll opacity-0 hover:text-accent transition-colors cursor-none [writing-mode:vertical-rl]" data-interactive="true" data-cursor-type="social">Email</a>
        </div>



      </div>
    </section>
  );
}
