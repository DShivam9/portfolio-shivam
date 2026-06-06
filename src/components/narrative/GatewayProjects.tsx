"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GatewayProjects() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "center 45%",
        scrub: true
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, scale: 1.05, y: -40, filter: "blur(12px)" },
      { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 },
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
          What I&apos;ve<br />
          <span 
            className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent"
            style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
          >
            Built
          </span>
        </h2>
      </div>
    </section>
  );
}
