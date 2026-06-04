"use client";

import React, { useState } from "react";
import gsap from "gsap";

interface SkillRuneProps {
  glyph: string;
  name: string;
  proof: string;
}

export default function SkillRune({ glyph, name, proof }: SkillRuneProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    window.dispatchEvent(new CustomEvent('katanaHover', { detail: { name, active: true } }));
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    window.dispatchEvent(new CustomEvent('katanaHover', { detail: { name, active: false } }));
  };

  return (
    <div 
      className="relative group border-b border-border-subtle py-4 cursor-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-interactive
    >
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-6">
          <span className={`text-heading font-cormorant transition-colors duration-300 ${isHovered ? 'text-ember' : 'text-ink-tertiary'}`}>
            {glyph}
          </span>
          <span className={`text-mono text-sm transition-colors duration-300 ${isHovered ? 'text-ink-primary' : 'text-ink-secondary'}`}>
            {name}
          </span>
        </div>
        
        {/* Subtle arrow indicator */}
        <span className={`text-micro transition-all duration-300 ${isHovered ? 'opacity-100 text-ember translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          +
        </span>
      </div>

      {/* Proof / Detail Reveal on Hover */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHovered ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <p className="text-small text-ink-secondary pl-14 pb-2 italic">
          "{proof}"
        </p>
      </div>

      {/* Hover Background Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-ember/5 to-transparent -z-10 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
