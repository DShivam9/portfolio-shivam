"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RuneDivider from "../ui/RuneDivider";
import { useScrollStore } from "@/store/scrollStore";
import SplitTextReveal from "../ui/SplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

const FocusPullPhoto = ({ src, alt }: { src: string, alt: string }) => {
  return (
    <div className="photo-card-container relative w-full rounded-xl bg-[#020202] overflow-hidden group cursor-pointer">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto block rounded-xl relative z-10 opacity-70 grayscale-[40%] scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
      {/* Vignette that softens on hover */}
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-20 transition-opacity duration-[800ms] group-hover:opacity-60" />
      {/* Golden tint overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/30 via-accent/5 to-transparent mix-blend-overlay pointer-events-none z-20 transition-opacity duration-[800ms] group-hover:opacity-100 opacity-60" />
    </div>
  );
};

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

    // ── Drop Cap Scrub Animation ──
    const dropCaps = containerRef.current.querySelectorAll(".drop-cap-letter");
    dropCaps.forEach((cap) => {
      const triggerContainer = cap.nextElementSibling;
      gsap.fromTo(cap,
        { opacity: 0.1, filter: "blur(8px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: triggerContainer,
            start: "top 90%",
            end: "top 55%",
            scrub: true,
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
            <span className="drop-cap-letter float-left text-accent font-serif font-semibold text-7xl md:text-8xl leading-none mr-5 mt-2">I</span>
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-xl md:text-2xl leading-loose tracking-wide max-w-2xl">
              enjoy building products that combine <span className="text-accent font-medium">thoughtful user experiences</span> with <span className="text-accent font-medium">solid engineering</span>. My strongest interests lie in <span className="text-accent font-medium">frontend and full-stack development</span>, where I can work on everything from crafting intuitive interfaces to implementing the systems that power them. What motivates me most is turning ideas into <span className="text-accent font-medium">real products</span> that people can use, explore, and benefit from.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[320px] md:max-w-[400px]">
            <FocusPullPhoto src="/about/trip_photo_1.jpeg" alt="Shivam Diwan" />
          </div>
        </div>

        {/* ── Para 2 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0">
            <span className="drop-cap-letter float-left text-accent font-serif font-semibold text-7xl md:text-8xl leading-none mr-5 mt-2">I</span>
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-xl md:text-2xl leading-loose tracking-wide max-w-2xl">
              learn best by building. Every project I take on is an opportunity to <span className="text-accent font-medium">explore new technologies</span>, solve unfamiliar problems, and expand my understanding of how <span className="text-accent font-medium">great software</span> is made. Whether it's shipping a full-stack application, integrating modern tools and workflows, or refining a product through multiple iterations, I enjoy the process of <span className="text-accent font-medium">continuously improving</span> both the product and myself.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[440px] md:max-w-[500px]">
            <FocusPullPhoto src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM.jpeg" alt="Craft" />
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
            <span className="drop-cap-letter float-left text-accent font-serif font-semibold text-7xl md:text-8xl leading-none mr-5 mt-2">W</span>
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-xl md:text-2xl leading-loose tracking-wide max-w-2xl">
              hat sets me apart is not a single technology, but the way I approach my work. I <span className="text-accent font-medium">take ownership</span> of the things I build, pay <span className="text-accent font-medium">close attention to details</span>, adapt quickly when faced with new challenges, and genuinely enjoy figuring things out. I believe strong software comes from <span className="text-accent font-medium">curiosity, persistence</span>, and a willingness to <span className="text-accent font-medium">keep refining</span> until the result feels right.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[460px] md:max-w-[500px]">
            <FocusPullPhoto src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (1).jpeg" alt="Method" />
          </div>
        </div>

        {/* ── Para 4 + Photo ── */}
        <div className="self-stretch flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <div className="flex-1 min-w-0">
            <span className="drop-cap-letter float-left text-accent font-serif font-semibold text-7xl md:text-8xl leading-none mr-5 mt-2">I</span>
            <SplitTextReveal animation="scrub" type="words" className="font-light text-text-secondary text-xl md:text-2xl leading-loose tracking-wide max-w-2xl">
              care deeply about <span className="text-accent font-medium">craftsmanship</span>. Too much of the modern web feels generic, rushed, and interchangeable. I am drawn to building products that feel <span className="text-accent font-medium">intentional</span>—software that is <span className="text-accent font-medium">reliable, polished, and enjoyable</span> to use. My goal is to continue growing as an engineer, contribute to meaningful products, and eventually <span className="text-accent font-medium">lead teams</span> that share the same commitment to quality and continuous improvement.
            </SplitTextReveal>
          </div>
          
          <div className="shrink-0 w-full max-w-[350px] md:max-w-[400px]">
            <FocusPullPhoto src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (2).jpeg" alt="Vision" />
          </div>
        </div>

      </div>
    </section>
  );
}
