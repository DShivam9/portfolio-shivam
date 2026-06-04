"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL",
  "Three.js", "WebGL", "GSAP", "Framer Motion", "Tailwind CSS",
  "Figma", "UI/UX", "System Architecture", "Performance"
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(pillRefs.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-48 px-6 md:px-24 flex flex-col items-center">
      
      <div className="text-mono text-text-tertiary mb-16">
        03 / CORE COMPETENCIES
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
        {SKILLS.map((skill, idx) => (
          <span 
            key={idx}
            ref={el => { pillRefs.current[idx] = el; }}
            className="text-body font-medium text-text-primary px-6 py-3 rounded-full border border-text-tertiary/20 bg-text-tertiary/5 hover:bg-text-primary hover:text-bg-base transition-colors duration-300 cursor-none"
            data-interactive="true"
          >
            {skill}
          </span>
        ))}
      </div>
      
    </section>
  );
}
