"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <section id="contact" ref={containerRef} className="relative w-full min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
      
      <div ref={textRef} className="z-10 flex flex-col items-center max-w-2xl">
        <div className="text-mono text-text-tertiary mb-8">
          04 / INQUIRIES
        </div>
        
        <h2 className="text-display text-text-primary mb-8 tracking-tighter">
          Let's talk.
        </h2>

        <p className="text-body text-text-secondary mb-16">
          Currently open for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
        </p>

        <a href="mailto:hello@example.com" className="text-body font-medium text-bg-base bg-text-primary px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 cursor-none" data-interactive="true" data-cursor-type="cta">
          hello@example.com
        </a>

        <div className="flex gap-8 mt-32">
          <a href="#" className="text-mono text-text-secondary hover:text-text-primary transition-colors cursor-none" data-interactive="true" data-cursor-type="social">GitHub</a>
          <a href="#" className="text-mono text-text-secondary hover:text-text-primary transition-colors cursor-none" data-interactive="true" data-cursor-type="social">Twitter</a>
          <a href="#" className="text-mono text-text-secondary hover:text-text-primary transition-colors cursor-none" data-interactive="true" data-cursor-type="social">LinkedIn</a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-mono text-text-tertiary/50 w-full text-center">
        © {new Date().getFullYear()} SHIVAM DIWAN. ALL RIGHTS RESERVED.
      </div>

    </section>
  );
}
