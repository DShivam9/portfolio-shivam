"use client";

import React, { useRef } from "react";
import HeroCrystalScene from '../3d/HeroCrystal/HeroCrystalScene';

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[120vh] bg-black z-10 overflow-hidden"
    >
      {/* Section Heading Overlay */}
      <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center w-full px-4">
        <h2 className="text-[clamp(3rem,5vw,5rem)] md:text-display text-text-primary tracking-tight leading-[1.1] drop-shadow-2xl">
          Skills<br />
          <span 
            className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent text-[clamp(1.5rem,3vw,3rem)] md:text-6xl mt-2 inline-block"
            style={{ paddingLeft: '0.15em', paddingRight: '0.15em', marginLeft: '-0.15em', marginRight: '-0.15em' }}
          >
            The Monolith of Craft
          </span>
        </h2>
      </div>

      <HeroCrystalScene />
    </section>
  );
}
