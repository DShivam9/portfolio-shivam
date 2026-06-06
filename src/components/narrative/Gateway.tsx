"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gateway() {
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
      { opacity: 0, scale: 0.98, y: 100, filter: "blur(16px)" },
      { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 },
      0
    );

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-40 flex flex-col items-center justify-center bg-transparent z-10"
    >
      <div ref={textRef} className="flex flex-col items-center text-center z-10" style={{ willChange: 'transform, opacity, filter' }}>
        <h2 className="text-display text-text-primary tracking-tight leading-[1.1]">
          The Person Behind<br />
          <span 
            className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent"
            style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
          >
            The Code
          </span>
        </h2>
      </div>
    </section>
  );
}
