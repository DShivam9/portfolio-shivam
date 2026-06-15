"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GatewayProps {
  title: React.ReactNode;
  highlight: React.ReactNode;
  variant?: "scale" | "rotate";
}

export default function Gateway({ title, highlight, variant = "scale" }: GatewayProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1
      }
    });

    const enterProps = variant === "scale" 
      ? { opacity: 0, scale: 0.95, y: 80, filter: "blur(16px)" }
      : { opacity: 0, rotationX: -25, y: 80, filter: "blur(16px)", transformOrigin: "bottom center" };
    
    const enterTargetProps = variant === "scale"
      ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 }
      : { opacity: 1, rotationX: 0, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 };

    // Phase 1: Enter
    tl.fromTo(textRef.current, enterProps, enterTargetProps, 0);

    // Phase 2: Hold
    tl.to(textRef.current, { opacity: 1, duration: 0.5 });

    // Phase 3: Exit
    tl.to(textRef.current,
      { opacity: 0, scale: 1.05, y: -80, filter: "blur(16px)", ease: "power2.in", duration: 1 }
    );

  }, { scope: containerRef });

  const styleProps: React.CSSProperties = { 
    willChange: 'transform, opacity, filter',
    ...(variant === "rotate" ? { perspective: '1000px' } : {})
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-transparent z-10"
    >
      <div ref={textRef} className="flex flex-col items-center text-center z-10" style={styleProps}>
        <h2 className="text-display text-text-primary tracking-tight leading-[1.1]">
          {title}<br />
          <span 
            className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent"
            style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
          >
            {highlight}
          </span>
        </h2>
      </div>
    </section>
  );
}
