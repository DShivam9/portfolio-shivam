"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GatewaySkills() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;

    // Use a timeline so blur clears quickly while position/opacity animate cinematically
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Blur resolves smoothly but finishes before the movement does
    tl.fromTo(textRef.current,
      { filter: "blur(4px)" },
      { filter: "blur(0px)", duration: 0.9, ease: "power3.out", clearProps: "filter" },
      0
    );

    // Position, scale, opacity animate at a cinematic pace
    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: "power3.out" },
      0
    );

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-transparent z-10"
    >
      <div ref={textRef} className="flex flex-col items-center text-center z-10" style={{ willChange: 'transform, opacity, filter' }}>
        <h2 className="text-display text-text-primary tracking-tight leading-[1.1]">
          Architectural<br />
          <span className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent">Capabilities</span>
        </h2>
      </div>
    </section>
  );
}
