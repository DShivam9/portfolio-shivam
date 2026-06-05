"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FooterShaderBg from "@/components/ui/FooterShaderBg";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // ── Scrub-driven editorial reveal ──
    // Matches the site's signature blur+y scroll-scrub from About/Hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        end: "top 10%",
        scrub: 1.5,
      },
    });

    // Tagline row
    const tagline = containerRef.current.querySelector(".ft-tagline");
    if (tagline) {
      tl.fromTo(tagline,
        { opacity: 0, y: 40, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, ease: "none", clearProps: "filter" },
        0
      );
    }

    // Giant name characters — handled by the self-writing loop below, NOT the scrub timeline

    // Hairline dividers expand
    const dividers = containerRef.current.querySelectorAll(".ft-line");
    dividers.forEach((div) => {
      tl.fromTo(div,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.25, ease: "none" },
        0.12
      );
    });

    // Info grid columns — staggered
    const infoCols = containerRef.current.querySelectorAll(".ft-col");
    if (infoCols.length > 0) {
      tl.fromTo(infoCols,
        { opacity: 0, y: 25, filter: "blur(3px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.06,
          duration: 0.2,
          ease: "none",
          clearProps: "filter"
        },
        0.18
      );
    }

    // Bottom bar
    const bottomBar = containerRef.current.querySelector(".ft-bottom");
    if (bottomBar) {
      tl.fromTo(bottomBar,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.15, ease: "none" },
        0.28
      );
    }

    // ── Floating particle on the divider lines ──
    const particles = containerRef.current.querySelectorAll(".ft-particle");
    particles.forEach((p) => {
      gsap.fromTo(p,
        { left: "0%", opacity: 0 },
        {
          left: "100%", opacity: 1,
          duration: 10, repeat: -1, ease: "none",
          keyframes: [
            { opacity: 0.7, offset: 0.08 },
            { opacity: 0.7, offset: 0.92 },
            { opacity: 0, offset: 1.0 },
          ],
        }
      );
    });

    // ── Accent word: gentle opacity pulse (no glow) ──
    const accentWord = containerRef.current.querySelector(".ft-accent-word");
    if (accentWord) {
      gsap.fromTo(accentWord,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }

    // ── Self-writing loop: triggered when footer scrolls into view ──
    const allNameChars = containerRef.current.querySelectorAll(".ft-char");
    if (allNameChars.length > 0) {
      // Start fully visible by default
      gsap.set(allNameChars, { clipPath: "inset(0 0% 0 0)" });

      // Build the writing timeline (paused — started by ScrollTrigger after delay)
      // Every repeat will have a 10-second delay
      const writeTl = gsap.timeline({ repeat: -1, repeatDelay: 10, paused: true });

      // 1. Erase: letters clip away from right-to-left
      writeTl.to(allNameChars, {
        clipPath: "inset(0 0 0 100%)",
        stagger: { each: 0.08, from: "end" },
        duration: 0.4,
        ease: "power2.in",
      }, 0);

      // 2. Instantly reset to hidden on the left
      writeTl.set(allNameChars, { clipPath: "inset(0 100% 0 0)" });

      // 3. Write in: letters reveal left-to-right
      writeTl.to(allNameChars, {
        clipPath: "inset(0 0% 0 0)",
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
      }, "+=0.25"); // subtle delay after full erase before writing back in

      // Start the loop after 10 seconds when the section enters the viewport
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.delayedCall(10, () => writeTl.play());
        },
        once: true,
      });
    }

  }, { scope: containerRef });

  const firstName = "SHIVAM";
  const lastName = "DIWAN";

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full h-[100dvh] flex flex-col bg-transparent z-10 overflow-hidden"
    >
      {/* Shader BG */}
      <FooterShaderBg />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle,rgba(232,168,74,0.012)_0%,transparent_75%)] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ═══════════════════════════════════════════════
          EDITORIAL FOOTER — Full Viewport
          3 vertical zones: Tagline → Giant Name → Info Grid
         ═══════════════════════════════════════════════ */}

      <div className="relative z-10 flex flex-col h-full w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">

        {/* ─── ZONE 1: Tagline + top accent ─── */}
        <div className="flex-shrink-0 pt-12 md:pt-16 lg:pt-20">
          <div
            className="ft-tagline flex items-start justify-between"
            style={{ opacity: 0, willChange: "transform, opacity, filter" }}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5vw] xl:text-[3vw] font-serif font-light text-text-secondary/80 leading-[1.15] max-w-2xl lg:max-w-3xl">
              Let&apos;s craft something{" "}
              <span className="ft-accent-word italic text-accent">extraordinary</span>
              <span className="text-accent/60">.</span>
            </p>

            {/* Availability indicator — elegant editorial style */}
            <div className="hidden md:flex items-center gap-3 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/70 shadow-[0_0_6px_rgba(232,168,74,0.4)]" />
              <span className="font-serif italic text-sm text-accent/60 tracking-wide">
                Open to new projects
              </span>
            </div>
          </div>
        </div>

        {/* ─── ZONE 2: Giant Name — centered vertically ─── */}
        <div
          className="flex-1 flex flex-col items-start justify-center select-none w-full gap-0"
          style={{ perspective: "1200px" }}
        >
          {/* First name — full width, left-aligned with inline paddingLeft shift */}
          <div className="w-full overflow-visible" style={{ lineHeight: '1.1', marginBottom: '-2.5vw', paddingLeft: '8vw' }}>
            <span className="block font-serif font-light tracking-wider text-[16vw] sm:text-[15vw] md:text-[14vw] lg:text-[13vw] text-text-primary/95">
              {firstName.split("").map((ch, i) => (
                <span
                  key={`f-${i}`}
                  className="ft-char ft-char-first inline-block"
                  style={{
                    willChange: "clip-path",
                    padding: "0.12em 0.15em",
                    margin: "0 -0.15em",
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>

          {/* Hairline between names */}
          <div
            className="ft-line h-[1px] w-full my-0 origin-left relative"
            style={{
              background: "linear-gradient(90deg, rgba(232,168,74,0.3) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              willChange: "transform",
            }}
          >
            <div className="ft-particle absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent blur-[1px] shadow-[0_0_8px_#E8A84A] opacity-0" />
          </div>

          {/* Last name — offset right, outlined italic with inline paddingRight shift */}
          <div className="ft-last-name-block w-full overflow-visible text-right" style={{ lineHeight: '1.1', marginTop: '-2.5vw', paddingRight: '15vw' }}>
            <span className="inline-block font-serif font-light italic tracking-wider text-[16vw] sm:text-[15vw] md:text-[14vw] lg:text-[13vw] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.18)]">
              {lastName.split("").map((ch, i) => (
                <span
                  key={`l-${i}`}
                  className="ft-char ft-char-last inline-block"
                  style={{
                    willChange: "clip-path",
                    padding: "0.12em 0.25em",
                    margin: "0 -0.25em",
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* ─── ZONE 3: Editorial Info Grid — bottom anchored ─── */}
        <div className="flex-shrink-0 pb-6 md:pb-10">

          {/* Divider */}
          <div
            className="ft-line h-[1px] w-full mb-8 md:mb-10 origin-left relative"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
              willChange: "transform",
            }}
          >
            <div className="ft-particle absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/40 blur-[0.5px] shadow-[0_0_4px_rgba(255,255,255,0.3)] opacity-0" />
          </div>

          {/* Info columns — spread across full width */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-8 md:gap-x-6 mb-8 md:mb-10">

            {/* Col 1: Email */}
            <div className="ft-col flex flex-col gap-4" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-accent/60 uppercase">Email</span>
              <a
                href="mailto:hello@shivamdiwan.com"
                className="font-sans text-sm md:text-base text-text-secondary/70 hover:text-white transition-colors duration-500 cursor-none leading-relaxed"
                data-interactive="true"
              >
                hello@shivamdiwan.com
              </a>
            </div>

            {/* Col 2: Socials */}
            <div className="ft-col flex flex-col gap-4" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-accent/60 uppercase">Social</span>
              <div className="flex flex-col gap-2">
                {[
                  { href: "https://github.com/DShivam9", label: "GitHub" },
                  { href: "https://linkedin.com", label: "LinkedIn" },
                  { href: "https://twitter.com", label: "Twitter / X" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-sm md:text-base text-text-secondary/70 hover:text-white transition-colors duration-500 cursor-none"
                    data-interactive="true"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3: Location */}
            <div className="ft-col flex flex-col gap-4" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-accent/60 uppercase">Location</span>
              <span className="font-sans text-sm md:text-base text-text-secondary/70 leading-relaxed">
                India
              </span>
            </div>

            {/* Col 4: Expertise */}
            <div className="ft-col hidden md:flex flex-col gap-4" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-accent/60 uppercase">Focus</span>
              <div className="flex flex-col gap-2">
                <span className="font-sans text-sm md:text-base text-text-secondary/70">3D & WebGL</span>
                <span className="font-sans text-sm md:text-base text-text-secondary/70">Interactive Design</span>
                <span className="font-sans text-sm md:text-base text-text-secondary/70">Full-Stack Engineering</span>
              </div>
            </div>

            {/* Col 5: CTA — right-aligned on desktop */}
            <div className="ft-col col-span-2 sm:col-span-1 flex flex-col gap-4 sm:items-end" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-accent/60 uppercase">Start a project</span>
              <a
                href="mailto:hello@shivamdiwan.com"
                className="group flex items-center gap-4 cursor-none"
                data-interactive="true"
              >
                <span className="font-serif italic text-lg md:text-xl lg:text-2xl text-text-secondary/50 group-hover:text-accent transition-colors duration-700">
                  Get in touch
                </span>
                <span className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 group-hover:border-accent/40 flex items-center justify-center transition-all duration-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="text-text-tertiary/40 group-hover:text-accent transition-all duration-700"
                    style={{ transition: "color 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)" }}
                  >
                    <path d="M2 1H9V8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Bottom bar — copyright */}
          <div
            className="ft-bottom flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-white/[0.04] pt-5"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <span className="font-mono text-[8px] md:text-[9px] tracking-[0.22em] text-text-tertiary/35 uppercase">
              © {new Date().getFullYear()} Shivam Diwan. All rights reserved.
            </span>
            <span className="font-mono text-[8px] md:text-[9px] tracking-[0.22em] text-text-tertiary/35 uppercase">
              Designed & Developed in India
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
