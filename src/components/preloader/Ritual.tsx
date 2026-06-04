"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Ritual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden";
    
    // Allow skip after 1.5s
    const skipTimer = setTimeout(() => setCanSkip(true), 1500);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "auto";
      }
    });

    // Frame 1: Sigil draws itself
    if (sigilRef.current) {
      const length = sigilRef.current.getTotalLength();
      gsap.set(sigilRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      tl.to(sigilRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    // Frame 2: Text fades in
    if (textRef.current) {
      const chars = textRef.current.innerText.split("");
      textRef.current.innerText = "";
      
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.opacity = "0";
        textRef.current?.appendChild(span);
      });

      tl.to(textRef.current.children, {
        opacity: 1,
        stagger: 0.05,
        duration: 0.1,
      }, "-=0.5");
      
      // Frame 3: Glow and change text
      tl.to(sigilRef.current, {
        fill: "var(--ember)",
        filter: "drop-shadow(0 0 10px rgba(200, 130, 42, 0.8))",
        duration: 0.5,
      });
      
      tl.to(textRef.current.children, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (textRef.current) {
            textRef.current.innerHTML = "<span class='text-ember'>The Codex is ready.</span>";
            gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
          }
        }
      });
    }

    // Frame 4: Curtain wipe upward
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.8,
    });

    return () => {
      clearTimeout(skipTimer);
      document.body.style.overflow = "auto";
      tl.kill();
    };
  }, []);

  const handleSkip = () => {
    if (!canSkip || isComplete) return;
    
    gsap.killTweensOf("*");
    
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "auto";
      }
    });
  };

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-void cursor-none"
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Abstract Sigil 'S' */}
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            ref={sigilRef}
            d="M 80 20 L 20 20 L 20 50 L 80 50 L 80 80 L 20 80" 
            stroke="var(--ember)" 
            strokeWidth="2" 
            strokeLinecap="square"
            fill="transparent"
          />
        </svg>

        <div className="h-6">
          <div ref={textRef} className="text-mono text-ink-secondary">
            Loading the Codex...
          </div>
        </div>
      </div>

      {canSkip && (
        <div className="absolute bottom-12 text-micro text-ink-tertiary animate-pulse">
          Click to skip ritual
        </div>
      )}
    </div>
  );
}
