"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: "words" | "chars" | "lines";
  animation?: "curtain" | "scrub";
  delay?: number;
}

export default function SplitTextReveal({
  children,
  className = "",
  style,
  type = "words",
  animation = "curtain",
  delay = 0,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait a tick for fonts/layout to settle before splitting
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      
      const split = new SplitType(containerRef.current, { types: type });
      const elements = type === "words" ? split.words : type === "chars" ? split.chars : split.lines;
      
      if (!elements || elements.length === 0) return;

      if (animation === "curtain") {
        // Wrap elements in overflow-hidden spans for the curtain effect
        elements.forEach((el) => {
          const wrapper = document.createElement("span");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "top";
          if (el.parentNode) {
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
          }
        });

        gsap.fromTo(
          elements,
          { y: "110%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.03,
            delay: delay,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else if (animation === "scrub") {
        gsap.fromTo(
          elements,
          { opacity: 0.1, filter: "blur(8px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.05,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              end: "top 55%",
              scrub: true,
            },
          }
        );
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      // Let React handle cleanup on unmount
    };
  }, [type, animation, delay]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
