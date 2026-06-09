"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const NAV_ITEMS = ['About', 'Projects', 'Contact'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLButtonElement | null)[]>([]);
  const overlayTl = useRef<gsap.core.Timeline | null>(null);

  const scrollTo = useCallback((selector: string) => {
    setIsOpen(false); // Close menu first
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // Wait for overlay animation to reverse
  }, []);

  // Initial cinematic entrance for header
  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  // Overlay Animation Setup
  useEffect(() => {
    if (!overlayRef.current) return;
    
    // Setup timeline only once
    if (!overlayTl.current) {
      overlayTl.current = gsap.timeline({ paused: true });
      
      // Blur and darken the background
      overlayTl.current.to(overlayRef.current, {
        autoAlpha: 1,
        backdropFilter: "blur(24px)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        duration: 0.7,
        ease: "power2.inOut"
      });
      
      // Sweep in the huge links
      overlayTl.current.fromTo(linksRef.current, {
        y: 80,
        opacity: 0,
        rotationX: -30,
        filter: "blur(10px)"
      }, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        filter: "blur(0px)",
        duration: 1.0,
        stagger: 0.1,
        ease: "expo.out",
        clearProps: "filter"
      }, "-=0.3");
    }

    if (isOpen) {
      overlayTl.current.play();
      document.body.style.overflow = "hidden"; // Prevent scrolling while open
    } else {
      overlayTl.current.reverse();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      {/* HEADER: Always on top, fixed to scroll */}
      <header ref={headerRef} className="fixed top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-[100] mix-blend-difference flex justify-between items-center pointer-events-none">
        
        {/* LOGO - Vertical Slide Reveal */}
        <div 
          ref={logoRef}
          className="pointer-events-auto cursor-none group relative overflow-hidden px-1 py-1" 
          onClick={() => {
            if (isOpen) setIsOpen(false);
            scrollTo('#hero');
          }}
          data-interactive="true"
          data-cursor-type="logo"
        >
          <div className="relative font-serif italic text-xl md:text-2xl leading-none">
            <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[120%]">
              Shivam Diwan
            </span>
            <span className="absolute inset-0 block text-[#E8A84A] translate-y-[120%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
              Shivam Diwan
            </span>
          </div>
        </div>

        {/* MENU BUTTON - Expanding Lines */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto cursor-none flex flex-col items-end justify-center w-12 h-12 gap-2 group"
          data-interactive="true"
          aria-label="Toggle menu"
        >
          {/* Top Line */}
          <div 
            className={`h-[1px] transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
              isOpen 
                ? 'w-8 translate-y-[9px] rotate-45 bg-[#E8A84A]' 
                : 'w-8 bg-white group-hover:w-10 group-hover:bg-[#E8A84A]'
            }`} 
          />
          {/* Bottom Line */}
          <div 
            className={`h-[1px] transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
              isOpen 
                ? 'w-8 -translate-y-[9px] -rotate-45 bg-[#E8A84A]' 
                : 'w-5 bg-white group-hover:w-10 group-hover:bg-[#E8A84A]'
            }`} 
          />
        </button>
      </header>

      {/* FULLSCREEN OVERLAY */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[90] flex items-center justify-center invisible opacity-0 pointer-events-none"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <nav className="flex flex-col items-start gap-8 md:gap-12 perspective-[1000px]">
          {NAV_ITEMS.map((item, i) => (
            <button 
              key={item} 
              ref={el => { linksRef.current[i] = el; }}
              className="cursor-none group relative flex items-center"
              onClick={() => scrollTo(`#${item.toLowerCase()}`)}
              data-interactive="true"
            >
              {/* Decorative sliding dash */}
              <span className="absolute -left-12 h-[2px] w-8 bg-[#E8A84A] opacity-0 -translate-x-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0" />
              
              {/* Outlined text that fills on hover */}
              <span className="block font-serif italic text-6xl md:text-8xl text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white group-hover:[-webkit-text-stroke:1px_transparent] group-hover:translate-x-6">
                {item}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
