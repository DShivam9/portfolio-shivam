"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/DShivam9' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/shivam-diwan-84a1b9342/' },
  { label: 'RESUME', href: '/resume' }
];

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs for the new Mask Reveal animation
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  // Ref for the ambient moving light
  const ambientLightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // HIGH-END EDITORIAL CINEMATIC REVEAL
    
    if (!line1Ref.current || !line2Ref.current || !nameRef.current) return;

    // Split texts into characters for cinematic staggering
    const splitLine1 = new SplitType(line1Ref.current, { types: 'chars' });
    const splitLine2 = new SplitType(line2Ref.current, { types: 'chars' });
    const splitName = new SplitType(nameRef.current, { types: 'chars' });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", 
      },
      onComplete: () => {
        // ── High-End Editorial Continuous Animations ──
        // These only start AFTER the entrance reveal is completely finished.

        // 1. Cinematic Background Light Sweep
        if (ambientLightRef.current) {
          gsap.to(ambientLightRef.current, {
            x: "5vw",
            y: "-5vh",
            opacity: 0.15,
            scale: 1.1,
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }

        if (lightRef.current) {
          gsap.to(lightRef.current, {
            x: "-5vw",
            scale: 1.05,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }

        // 2. Ultra-Premium Editorial Name Animation (Apple "Pro" Style)
        // Staggered character loops can feel cheap or busy. A truly expensive feel 
        // treats the typography as a solid, monumental object reacting to a slow light sweep.
        
        splitName.revert(); // Revert the characters back to a single solid block

        if (nameRef.current) {
          // Clear any leftover inline background styles from previous attempts
          nameRef.current.style.backgroundImage = "none";
          nameRef.current.style.color = "rgba(255,255,255,0.7)";
          nameRef.current.style.backgroundClip = "border-box";
          nameRef.current.style.WebkitBackgroundClip = "border-box";
          
          // A truly high-end editorial glow effect. Not bouncy, not shimmering. 
          // Just a very slow, deep, subtle atmospheric breath of light.
          gsap.fromTo(nameRef.current, {
            textShadow: "0px 0px 0px rgba(255, 223, 153, 0)",
            color: "rgba(255, 255, 255, 0.7)",
          }, {
            textShadow: "0px 10px 40px rgba(255, 223, 153, 0.5)",
            color: "rgba(255, 255, 255, 1)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    });

    // 1. Cinematic Character Reveal for Headers
    tl.fromTo(splitLine1.chars, 
      { y: 100, opacity: 0, rotateX: -80, filter: "blur(20px)", scale: 0.8 },
      { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", scale: 1, duration: 2, stagger: 0.04, ease: "expo.out" }
    )
    .fromTo(splitLine2.chars, 
      { y: 100, opacity: 0, rotateX: -80, filter: "blur(20px)", scale: 0.8 },
      { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", scale: 1, duration: 2, stagger: 0.04, ease: "expo.out" },
      "-=1.8"
    )
    // 2. The Living Light swells in the background
    .fromTo(lightRef.current,
      { opacity: 0, scale: 0.5, filter: "blur(0px)" },
      { opacity: 0.25, scale: 1.2, filter: "blur(150px)", duration: 3, ease: "sine.out" },
      "-=2"
    )
    // 3. Email CTA fades in sharply with letter spacing contraction
    .fromTo(emailRef.current,
      { opacity: 0, y: 30, letterSpacing: "0.5em", filter: "blur(10px)" },
      { opacity: 1, y: 0, letterSpacing: "0.1em", filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
      "-=2"
    )
    // 4. Social Links blur and rise
    .fromTo(linksRef.current?.children || [],
      { opacity: 0, y: 40, rotateX: 45, filter: "blur(15px)" },
      { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 1.5, stagger: 0.15, ease: "expo.out" },
      "-=1.5"
    )
    // 5. Massive anchor name reveals character by character from the deep background
    .fromTo(splitName.chars,
      { opacity: 0, y: 250, rotateX: 90, scale: 0.5, filter: "blur(30px)" },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)", duration: 3, stagger: 0.05, ease: "expo.out" },
      "-=1.8"
    );

    return () => {
      splitLine1.revert();
      splitLine2.revert();
      splitName.revert();
    };
  }, { scope: containerRef });

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative min-h-screen bg-[#000000] text-white overflow-hidden flex flex-col justify-between pt-32 perspective-[2000px]"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* The Ambient Breathing Light */}
      <div 
        ref={ambientLightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[100vh] bg-accent/20 rounded-[100%] opacity-5 blur-[180px] pointer-events-none z-0 mix-blend-screen"
      />

      {/* --- The Living Light (Cinematic Spotlight) --- */}
      <div 
        ref={lightRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[90vw] md:w-[60vw] h-[70vh] bg-[#ffaa40] rounded-[100%] opacity-20 blur-[120px] md:blur-[150px] pointer-events-none z-0 mix-blend-screen"
        style={{ willChange: 'transform, opacity' }}
      ></div>

      {/* --- Cinematic Center (Main CTA) --- */}
      <div className="relative z-10 px-4 w-full flex-grow flex flex-col items-center justify-center pb-12 md:pb-20">
        
        <div className="text-center flex flex-col items-center gap-2">
          {/* Cinematic text wrappers */}
          <div className="pb-4 transform-style-3d">
            <span 
              ref={line1Ref} 
              className="block text-[12vw] md:text-[9vw] lg:text-[7.5vw] font-serif uppercase tracking-tighter leading-[0.85] italic text-white/40 font-light pr-8 md:pr-16 origin-bottom-left"
            >
              CRAFTING
            </span>
          </div>
          <div className="pb-4 transform-style-3d">
            <span 
              ref={line2Ref} 
              className="block text-[12vw] md:text-[9vw] lg:text-[7.5vw] font-serif uppercase tracking-tighter leading-[0.85] text-[#ffdf99] origin-bottom-left"
            >
              THE EXTRAORDINARY.
            </span>
          </div>
        </div>

        <a 
          ref={emailRef}
          href="mailto:shivamdiwan1500@gmail.com"
          className="mt-12 md:mt-16 group relative inline-flex items-center justify-center cursor-none p-4"
          data-interactive="true"
        >
          <span className="text-lg md:text-2xl font-mono tracking-widest uppercase text-white/50 group-hover:text-[#ffdf99] transition-colors duration-500 z-10 relative">
            START A CONVERSATION
          </span>
          <span className="absolute bottom-2 left-1/2 w-0 h-[1px] bg-[#ffdf99] group-hover:w-full group-hover:left-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"></span>
        </a>
      </div>

      {/* --- Editorial Bottom Section --- */}
      <div className="w-full mt-auto relative z-10 flex flex-col">
        
        {/* High-End Editorial Social Links Row */}
        <div 
          ref={linksRef}
          className="w-full border-t border-b border-white/10 flex flex-col md:flex-row justify-between items-center py-6 md:py-8 px-6 md:px-24 lg:px-32 mb-8 md:mb-12 transform-style-3d"
        >
          {SOCIAL_LINKS.map((link, i) => {
            const isInternal = link.href.startsWith('/');
            const LinkWrapper = isInternal ? Link : 'a';
            const extraProps = isInternal ? {} : { target: "_blank", rel: "noreferrer" };
            
            return (
            <LinkWrapper 
              key={link.label}
              href={link.href as any}
              {...extraProps}
              className="relative flex items-center justify-center group cursor-none w-full md:w-auto py-4 md:py-0 border-b border-white/5 md:border-none last:border-none"
              data-interactive="true"
            >
              <div className="relative px-2 py-1 pr-4">
                <span className="block text-2xl md:text-3xl lg:text-4xl font-serif italic text-white/50 group-hover:text-white transition-colors duration-500 ease-out relative z-10">
                  {link.label}
                </span>
                <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[#ffdf99] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
              </div>
            </LinkWrapper>
            );
          })}
        </div>

        {/* Massive Editorial Name */}
        <div className="w-full text-center px-4 mb-0 transform-style-3d cursor-default">
          <h1 
            ref={nameRef}
            className="text-[13vw] sm:text-[14vw] md:text-[15.5vw] leading-[0.8] font-serif tracking-tighter uppercase whitespace-nowrap text-white/90 origin-center"
            style={{ willChange: 'text-shadow, color' }}
          >
            SHIVAM DIWAN
          </h1>
        </div>

      </div>
      
    </section>
  );
}
