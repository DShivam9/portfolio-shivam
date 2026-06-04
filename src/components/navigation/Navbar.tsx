"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const NAV_ITEMS = ['About', 'Projects', 'Contact'];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  // Store refs for each nav link's individual letter spans
  const navLettersRef = useRef<Map<string, HTMLSpanElement[]>>(new Map());

  const scrollTo = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    // ---- CINEMATIC NAVBAR ENTRANCE ----
    const navTl = gsap.timeline({ delay: 0.4 });
    
    gsap.set(navRef.current, { opacity: 0 });
    navTl.to(navRef.current, { opacity: 1, duration: 0.3, ease: "none" });

    // Logo letters cascade in
    const logoLetters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(logoLetters, { y: 30, opacity: 0, filter: "blur(6px)" });
    navTl.to(logoLetters, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      stagger: { each: 0.04, from: "start" },
      ease: "power3.out"
    }, "-=0.1");

    // Nav link letters cascade in
    NAV_ITEMS.forEach((item) => {
      const letters = navLettersRef.current.get(item);
      if (!letters?.length) return;
      gsap.set(letters, { opacity: 0, y: 8 });
      navTl.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: { each: 0.03, from: "start" },
        ease: "power2.out"
      }, "-=0.4");
    });

    // ---- LOGO HOVER ----
    const logo = logoRef.current;
    if (!logo) return;

    let logoHoverTl: gsap.core.Timeline | null = null;

    const handleLogoEnter = () => {
      if (logoHoverTl) logoHoverTl.kill();
      const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
      logoHoverTl = gsap.timeline();
      logoHoverTl.to(letters, {
        y: -6,
        color: '#E8A84A',
        textShadow: '0 0 20px rgba(232,168,74,0.8), 0 0 40px rgba(232,168,74,0.3)',
        duration: 0.4,
        stagger: { each: 0.04, from: "start" },
        ease: "power2.out"
      });
      logoHoverTl.to(letters, {
        y: -2,
        duration: 0.6,
        stagger: { each: 0.03, from: "start" },
        ease: "elastic.out(1, 0.6)"
      }, "-=0.2");
    };

    const handleLogoLeave = () => {
      if (logoHoverTl) logoHoverTl.kill();
      const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
      logoHoverTl = gsap.timeline();
      logoHoverTl.to(letters, {
        y: 0,
        color: '#ffffff',
        textShadow: '0 0 0px rgba(232,168,74,0)',
        duration: 0.5,
        stagger: { each: 0.03, from: "end" },
        ease: "power3.out"
      });
    };

    logo.addEventListener("mouseenter", handleLogoEnter);
    logo.addEventListener("mouseleave", handleLogoLeave);

    // ---- NAV LINK HOVER — per-letter gold wave (same style as logo) ----
    const navHoverTls = new Map<string, gsap.core.Timeline>();

    const navElements = document.querySelectorAll(".nav-element");
    navElements.forEach((el) => {
      const item = el.getAttribute("data-nav-item") || "";
      
      el.addEventListener("mouseenter", () => {
        const existing = navHoverTls.get(item);
        if (existing) existing.kill();

        const letters = navLettersRef.current.get(item);
        if (!letters?.length) return;

        const tl = gsap.timeline();
        // Wave up + turn gold
        tl.to(letters, {
          y: -3,
          color: '#E8A84A',
          textShadow: '0 0 14px rgba(232,168,74,0.6)',
          duration: 0.3,
          stagger: { each: 0.025, from: "start" },
          ease: "power2.out"
        });
        // Settle back
        tl.to(letters, {
          y: -1,
          duration: 0.4,
          stagger: { each: 0.02, from: "start" },
          ease: "elastic.out(1, 0.5)"
        }, "-=0.15");
        
        navHoverTls.set(item, tl);
      });

      el.addEventListener("mouseleave", () => {
        const existing = navHoverTls.get(item);
        if (existing) existing.kill();

        const letters = navLettersRef.current.get(item);
        if (!letters?.length) return;

        const tl = gsap.timeline();
        tl.to(letters, {
          y: 0,
          color: 'rgba(255,255,255,0.6)',
          textShadow: '0 0 0px rgba(232,168,74,0)',
          duration: 0.35,
          stagger: { each: 0.02, from: "end" },
          ease: "power3.out"
        });
        navHoverTls.set(item, tl);
      });
    });

    return () => {
      logo.removeEventListener("mouseenter", handleLogoEnter);
      logo.removeEventListener("mouseleave", handleLogoLeave);
      if (logoHoverTl) logoHoverTl.kill();
      navHoverTls.forEach(tl => tl.kill());
    };
  }, []);

  const logoText = "Shivam Diwan";

  return (
    <header ref={navRef} className="absolute top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-50 mix-blend-difference pointer-events-none flex justify-between items-center">
      
      {/* LEFT: Logo with per-letter scatter */}
      <div 
        ref={logoRef}
        className="pointer-events-auto cursor-none" 
        onClick={() => scrollTo('#hero')}
        data-interactive="true"
        data-cursor-type="logo"
      >
        <div className="flex items-baseline gap-[1px]">
          {logoText.split("").map((char, i) => (
            <span 
              key={i} 
              ref={(el) => { lettersRef.current[i] = el; }}
              className={`inline-block font-serif italic text-white text-xl md:text-2xl leading-none transition-none ${char === " " ? "w-2" : ""}`}
              style={{ willChange: 'transform' }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT: Nav Links — per-letter animation matching logo style */}
      <nav className="flex items-center gap-8 md:gap-16 pointer-events-auto">
        {NAV_ITEMS.map((item) => (
          <button 
            key={item} 
            className="nav-element relative cursor-none py-2"
            onClick={() => scrollTo(`#${item.toLowerCase()}`)}
            data-interactive="true"
            data-cursor-type="nav"
            data-nav-item={item}
          >
            <span className="flex items-baseline gap-[0.5px]">
              {item.toUpperCase().split("").map((char, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) {
                      const existing = navLettersRef.current.get(item) || [];
                      existing[i] = el;
                      navLettersRef.current.set(item, existing);
                    }
                  }}
                  className="inline-block text-[11px] md:text-sm font-light leading-none"
                  style={{
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.6)',
                    willChange: 'transform',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}
