"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ProjectRelicProps {
  title: string;
  year: string;
  description: string;
  behindTheRelic: string;
  tags: string[];
  runeColor: string;
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectRelic({
  title,
  year,
  description,
  behindTheRelic,
  tags,
  runeColor,
  liveUrl,
  githubUrl
}: ProjectRelicProps) {
  const relicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!relicRef.current) return;

    gsap.fromTo(
      relicRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: relicRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  return (
    <div 
      ref={relicRef} 
      className="w-full relative group"
      style={{ '--relic-accent': runeColor } as React.CSSProperties}
    >
      {/* Dynamic glow based on rune color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: 'var(--relic-accent)' }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-border-subtle pb-6 relative z-10">
        <h3 className="text-display text-ink-primary font-cormorant leading-none">
          {title}
        </h3>
        <span className="text-mono text-ink-tertiary mt-4 md:mt-0">
          [{year}]
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        <div className="md:col-span-8 space-y-6">
          <p className="text-body text-ink-secondary">
            {description}
          </p>
          
          <div className="pl-6 border-l-2" style={{ borderColor: 'var(--relic-accent)' }}>
            <p className="text-small text-ink-tertiary italic">
              "Behind the Relic: {behindTheRelic}"
            </p>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col justify-between">
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-micro px-2 py-1 border border-border-subtle text-ink-secondary">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noreferrer" className="text-mono text-ink-primary hover:text-ember transition-colors" data-interactive>
                VIEW LIVE &nearr;
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-mono text-ink-tertiary hover:text-ink-primary transition-colors" data-interactive>
                SOURCE
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
