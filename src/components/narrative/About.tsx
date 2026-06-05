"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import RuneDivider from "../ui/RuneDivider";
import { useScrollStore } from "@/store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const setProgress = useScrollStore(state => state.setProgress);
  
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

    // ── Scroll-driven image parallax effect ──
    const parallaxWrappers = containerRef.current.querySelectorAll(".photo-card-img-wrap");
    parallaxWrappers.forEach((wrapper) => {
      const card = wrapper.closest(".photo-card-container");
      if (!card) return;
      gsap.fromTo(wrapper,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });

    // ── Scroll-driven line-by-line reveal for each paragraph block ──
    const blocks = containerRef.current.querySelectorAll(".lore-block");
    blocks.forEach((block) => {
      const label = block.querySelector(".section-label");
      const lines = block.querySelectorAll(".reveal-line");
      const elements = block.querySelectorAll(".reveal-element");

      // Non-text blocks (RuneDivider) — simple trigger-once fade
      if (lines.length === 0 && elements.length === 0) {
        gsap.fromTo(block,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
        return;
      }

      // Scrub-driven timeline: lines reveal as you scroll through each block
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
          end: "top 20%",
          scrub: 1.5,
        },
      });

      // Section label fades in first
      if (label) {
        tl.fromTo(
          label,
          { opacity: 0, y: 12 },
          { opacity: 0.6, y: 0, duration: 0.15, ease: "none" },
          0
        );
      }

      // Lines fade + rise in with stagger
      if (lines.length > 0) {
        tl.fromTo(
          lines,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.18,
            ease: "none",
          },
          0.08
        );
      }

      // Other elements (photos etc.) fade in after the text
      if (elements.length > 0) {
        tl.fromTo(
          elements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.25,
            ease: "none",
          },
          0.2
        );
      }
    });
  }, { scope: containerRef, dependencies: [setProgress] });

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative w-full bg-transparent text-white z-10"
      style={{ paddingTop: '6rem', paddingBottom: '10rem' }}
    >

      <div className="relative z-10 flex flex-col" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* ── Para 1 + Photo: LEFT text, RIGHT photo ── */}
        <div className="lore-block self-stretch flex flex-col md:flex-row items-center gap-8 md:gap-16" style={{ marginBottom: '10rem', paddingLeft: '5%' }}>
          {/* Text */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <span className="section-label block font-mono uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--color-accent)', opacity: 0, marginBottom: '1.5rem' }}>
              01 — Origin
            </span>
            <div className="font-light text-text-secondary" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.75rem)', lineHeight: 1.85, maxWidth: '700px' }}>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                <span className="font-serif text-accent" style={{ fontSize: '1.8em', lineHeight: 1, marginRight: '0.15em' }}>I</span>
                {" "}am a digital engineer bound to the creation of highly immersive,
              </span>
              <span className="reveal-line block" style={{ opacity: 0 }}>performant web experiences. By stripping away standard constraints,</span>
              <span className="reveal-line block" style={{ opacity: 0 }}>I seek to elevate the web from a mere document to an ethereal experience.</span>
            </div>
          </div>
          {/* Photo Card */}
          <div className="photo-card-container reveal-element relative shrink-0 group rounded-md overflow-hidden bg-[#020202]" style={{ width: '100%', maxWidth: '320px', aspectRatio: '320/420', opacity: 0 }}>
            <div className="photo-card-img-wrap absolute inset-x-0" style={{ top: '-6%', bottom: '-6%', willChange: 'transform' }}>
              <Image 
                src="/about/trip_photo_1.jpeg" 
                alt="Shivam Diwan" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
            <div className="photo-card-overlay absolute inset-0 bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] mix-blend-overlay opacity-50 pointer-events-none z-20" />
          </div>
        </div>

        {/* ── Para 2 + Photo: LEFT photo, RIGHT text ── */}
        <div className="lore-block self-stretch flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16" style={{ marginBottom: '10rem', paddingRight: '5%' }}>
          {/* Text */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <span className="section-label block font-mono uppercase md:text-right" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--color-accent)', opacity: 0, marginBottom: '1.5rem' }}>
              02 — Craft
            </span>
            <div className="font-light text-text-secondary md:text-right" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)', lineHeight: 1.85, marginLeft: 'auto', maxWidth: '650px' }}>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                <span className="font-serif text-accent" style={{ fontSize: '1.8em', lineHeight: 1, marginRight: '0.08em' }}>M</span>
                y journey began with a deep fascination for 3D realms and interactive mythos.
              </span>
              <span className="reveal-line block" style={{ opacity: 0 }}>Over the years, I have honed the craft of bridging rigorous technical architecture</span>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                with{" "}
                <span className="font-serif italic text-text-primary">boundary-pushing, magical design</span>.
              </span>
            </div>
          </div>
          {/* Photo Card */}
          <div className="photo-card-container reveal-element relative shrink-0 group rounded-md overflow-hidden bg-[#020202]" style={{ width: '100%', maxWidth: '440px', aspectRatio: '440/248', opacity: 0 }}>
            <div className="photo-card-img-wrap absolute inset-x-0" style={{ top: '-6%', bottom: '-6%', willChange: 'transform' }}>
              <Image 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM.jpeg" 
                alt="Shivam Diwan - Craft" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
            <div className="photo-card-overlay absolute inset-0 bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] mix-blend-overlay opacity-50 pointer-events-none z-20" />
          </div>
        </div>

        {/* ── Rune Divider: CENTER ── */}
        <div className="lore-block self-center" style={{ marginBottom: '10rem' }}>
          <div className="bg-bg-base/80 backdrop-blur-sm rounded-full border border-accent/20" style={{ padding: '0 2rem' }}>
            <RuneDivider />
          </div>
        </div>

        {/* ── Para 3 + Photo: LEFT text, RIGHT photo ── */}
        <div className="lore-block self-stretch flex flex-col md:flex-row items-center gap-8 md:gap-16" style={{ marginBottom: '10rem', paddingLeft: '8%' }}>
          {/* Text */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <span className="section-label block font-mono uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--color-accent)', opacity: 0, marginBottom: '1.5rem' }}>
              03 — Method
            </span>
            <div className="font-light text-text-secondary" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)', lineHeight: 1.85, maxWidth: '700px' }}>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                <span className="font-serif text-accent" style={{ fontSize: '1.8em', lineHeight: 1, marginRight: '0.08em' }}>W</span>
                hether orchestrating complex physics in WebGL or ensuring an application
              </span>
              <span className="reveal-line block" style={{ opacity: 0 }}>scales flawlessly, my approach is rooted in absolute precision.</span>
              <span className="reveal-line block" style={{ opacity: 0 }}>I believe that true digital elegance emerges only from a deep</span>
              <span className="reveal-line block" style={{ opacity: 0 }}>understanding of the underlying arcane systems.</span>
            </div>
          </div>
          {/* Photo Card */}
          <div className="photo-card-container reveal-element relative shrink-0 group rounded-md overflow-hidden bg-[#020202]" style={{ width: '100%', maxWidth: '460px', aspectRatio: '460/215', opacity: 0 }}>
            <div className="photo-card-img-wrap absolute inset-x-0" style={{ top: '-6%', bottom: '-6%', willChange: 'transform' }}>
              <Image 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (1).jpeg" 
                alt="Shivam Diwan - Method" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
            <div className="photo-card-overlay absolute inset-0 bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] mix-blend-overlay opacity-50 pointer-events-none z-20" />
          </div>
        </div>

        {/* ── Para 4 + Photo: LEFT photo, RIGHT text ── */}
        <div className="lore-block self-stretch flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16" style={{ paddingRight: '5%' }}>
          {/* Text */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <span className="section-label block font-mono uppercase md:text-right" style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--color-accent)', opacity: 0, marginBottom: '1.5rem' }}>
              04 — Vision
            </span>
            <div className="font-light text-text-secondary md:text-right" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.75rem)', lineHeight: 1.85, marginLeft: 'auto', maxWidth: '650px' }}>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                <span className="font-serif text-accent" style={{ fontSize: '1.8em', lineHeight: 1, marginRight: '0.1em' }}>C</span>
                urrently, I am exploring the intersection of spatial computing
              </span>
              <span className="reveal-line block" style={{ opacity: 0 }}>and the open web, forging interfaces that feel</span>
              <span className="reveal-line block" style={{ opacity: 0 }}>
                <span className="relative inline-block cursor-none group" data-interactive>
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-accent font-serif italic text-text-primary">
                    intuitive, human, and alive.
                  </span>
                </span>
              </span>
            </div>
          </div>
          {/* Photo Card */}
          <div className="photo-card-container reveal-element relative shrink-0 group rounded-md overflow-hidden bg-[#020202]" style={{ width: '100%', maxWidth: '350px', aspectRatio: '350/350', opacity: 0 }}>
            <div className="photo-card-img-wrap absolute inset-x-0" style={{ top: '-6%', bottom: '-6%', willChange: 'transform' }}>
              <Image 
                src="/about/WhatsApp Image 2026-06-04 at 10.16.29 PM (2).jpeg" 
                alt="Shivam Diwan - Vision" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-20" />
            <div className="photo-card-overlay absolute inset-0 bg-gradient-to-b from-accent/50 via-accent/10 to-transparent mix-blend-overlay pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] mix-blend-overlay opacity-50 pointer-events-none z-20" />
          </div>
        </div>

      </div>

    </section>
  );
}
