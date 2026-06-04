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

    gsap.fromTo(textRef.current,
      { opacity: 0, filter: "blur(20px)", scale: 0.9, y: 50 },
      { 
        opacity: 1, 
        filter: "blur(0px)", 
        scale: 1, 
        y: 0, 
        ease: "power3.out", 
        duration: 2,
        clearProps: "filter",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-40 flex flex-col items-center justify-center bg-transparent z-10"
    >
      <div ref={textRef} className="flex flex-col items-center text-center z-10">
        <h2 className="text-display text-text-primary tracking-tight leading-[1.1]">
          The Person Behind<br />
          <span className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent">The Code</span>
        </h2>
      </div>
    </section>
  );
}
