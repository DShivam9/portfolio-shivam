"use client";

import React, { useState } from 'react';
import { CREATIVE_TECH, CORE_ENGINEERING, SYSTEMS_DEVOPS, INTELLIGENT_AGENTS, TechItem } from '@/constants/skillsData';

const ALL_GROUPS = [
  CREATIVE_TECH,
  CORE_ENGINEERING,
  SYSTEMS_DEVOPS,
  INTELLIGENT_AGENTS
];

const GROUP_TITLES = ['Creative & Front-End', 'Core Engineering', 'Systems & DevOps', 'Intelligent Agents'];

const EditorialSkillItem = ({ tech }: { tech: TechItem }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-row items-start md:items-center justify-start gap-6 md:gap-10 py-8 border-b border-white/5 cursor-crosshair group transition-colors duration-700 hover:bg-white/[0.015] px-4 -mx-4 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-interactive="true"
      data-cursor-type="focus"
    >
      <div className={`transition-all duration-700 w-14 h-14 md:w-20 md:h-20 shrink-0 flex items-center justify-center ${isHovered ? 'grayscale-0 opacity-100 scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'grayscale opacity-30'}`}>
        <tech.IconComponent />
      </div>
      
      <div className="flex flex-col justify-center flex-1 max-w-xl pt-2 md:pt-0">
        <div className="relative">
          {/* Base Text */}
          <h4 className="font-serif italic text-2xl md:text-4xl tracking-wide text-white/60">
            {tech.name}
          </h4>
          {/* Runic Illumination Overlay */}
          <h4 
            className="absolute top-0 left-0 font-serif italic text-2xl md:text-4xl tracking-wide bg-gradient-to-r from-[#ffaa40] via-[#ffdf99] to-[#ffe8b3] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,223,153,0.4)] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              clipPath: isHovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
            }}
          >
            {tech.name}
          </h4>
        </div>

        <div 
          className="overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            maxHeight: isHovered ? '100px' : '0px',
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? '12px' : '0px',
            filter: isHovered ? 'blur(0px)' : 'blur(8px)',
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
          }}
        >
          <p className="text-[#888888] text-[0.7rem] md:text-sm tracking-[0.15em] leading-relaxed uppercase">
            {tech.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Skills() {
  return (
    <section className="relative w-full min-h-screen bg-transparent z-10 py-32 md:py-48">
      {/* ── Atmosphere ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(100,140,200,0.015) 0%, transparent 80%)`,
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Categories */}
        <div className="flex flex-col gap-32 md:gap-64">
          {ALL_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col lg:flex-row gap-16 lg:gap-32 relative">
              
              {/* Left Column: Sticky Title */}
              <div className="w-full lg:w-5/12">
                <div className="sticky top-[30vh]">
                  <h3 className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-accent/80 leading-[1.1] drop-shadow-lg">
                    {GROUP_TITLES[groupIndex]}
                  </h3>
                  <div className="mt-12 w-16 h-px bg-white/20 hidden lg:block" />
                </div>
              </div>

              {/* Right Column: Skill List */}
              <div className="w-full lg:w-7/12 flex flex-col">
                <div className="border-t border-white/5">
                  {group.map((tech) => (
                    <EditorialSkillItem key={tech.id} tech={tech} />
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
