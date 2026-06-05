"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  id: string;
  name: string;
  roman: string;
  desc: string;
  category: string;
}

const SKILLS_DATA: SkillItem[] = [
  // Creative Tech
  { id: "threejs", name: "Three.js", roman: "I", desc: "Interactive 3D scene graphs and WebGL graphics maps.", category: "Creative Tech" },
  { id: "webgl", name: "WebGL", roman: "II", desc: "GPU pipeline access and low-level custom render buffers.", category: "Creative Tech" },
  { id: "glsl", name: "GLSL Shaders", roman: "III", desc: "Custom fragment shaders, procedural noise, and raymarching.", category: "Creative Tech" },
  { id: "gsap", name: "GSAP", roman: "IV", desc: "High-frequency cinematic scroll and timeline tweening physics.", category: "Creative Tech" },
  { id: "framer", name: "Framer Motion", roman: "V", desc: "Declarative spring physics and custom route transitions.", category: "Creative Tech" },
  
  // Engineering Core
  { id: "react", name: "React", roman: "VI", desc: "Robust declarative architectures and optimized hook loops.", category: "Engineering Core" },
  { id: "nextjs", name: "Next.js", roman: "VII", desc: "Production App Router structures, SSR, and SSG rendering pipelines.", category: "Engineering Core" },
  { id: "typescript", name: "TypeScript", roman: "VIII", desc: "Compile-time strict type safety and generic schemas.", category: "Engineering Core" },
  { id: "tailwind", name: "Tailwind CSS", roman: "IX", desc: "Utility-first design token configurations and theme states.", category: "Engineering Core" },
  
  // Backend & Systems
  { id: "nodejs", name: "Node.js", roman: "X", desc: "Scalable event-driven event loop and REST/GraphQL APIs.", category: "Backend & Systems" },
  { id: "graphql", name: "GraphQL", roman: "XI", desc: "Flexible type-safe query interfaces and schema batch optimizations.", category: "Backend & Systems" },
  { id: "postgresql", name: "PostgreSQL", roman: "XII", desc: "Relational database queries, indexing, and connection pools.", category: "Backend & Systems" },
  { id: "docker", name: "Docker", roman: "XIII", desc: "Isolated virtualization containers and microservice environments.", category: "Backend & Systems" }
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);



  // Entrance animation for header and items
  useGSAP(() => {
    if (!containerRef.current) return;

    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { filter: "blur(5px)", opacity: 0, y: 40 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          clearProps: "filter"
        }
      );
    }

    // Stagger reveal on the columns
    const columns = containerRef.current.querySelectorAll(".frieze-column");
    columns.forEach((col, idx) => {
      gsap.fromTo(col,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          delay: idx * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: col,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { scope: containerRef });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (window.innerWidth >= 1024) {
      gsap.to(containerRef.current, {
        "--mouse-x": `${x}px`,
        "--mouse-y": `${y}px`,
        duration: 0.7,
        ease: "power2.out"
      });
    }
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    // Reset flashlight position to center-ish out of view when cursor leaves
    gsap.to(containerRef.current, {
      "--mouse-x": "50%",
      "--mouse-y": "-20%",
      duration: 1,
      ease: "power2.out"
    });
    setActiveId(null);
  };

  const creativeTech = SKILLS_DATA.filter(s => s.category === "Creative Tech");
  const engineeringCore = SKILLS_DATA.filter(s => s.category === "Engineering Core");
  const backendSystems = SKILLS_DATA.filter(s => s.category === "Backend & Systems");

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full pt-32 pb-48 md:pt-48 md:pb-64 px-6 md:px-12 lg:px-20 flex flex-col items-center z-10 overflow-hidden bg-[#030304]"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "-20%"
      } as React.CSSProperties}
    >
      <style>{`
        .carved-header {
          text-shadow: 0 1px 1px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.05);
        }

        .frieze-title {
          font-family: var(--font-sans), "Outfit", sans-serif !important;
        }

        .frieze-roman,
        .frieze-desc {
          font-family: var(--font-serif), "Melodrama", Georgia, serif !important;
        }
      `}</style>

      <div 
        ref={headingRef} 
        className="flex flex-col items-center text-center z-10 mb-20 md:mb-32" 
        style={{ willChange: 'transform, opacity, filter', opacity: 0 }}
      >
        <h2 className="text-display text-text-primary tracking-tight leading-[1.1] carved-header">
          Architectural<br />
          <span className="font-serif italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent px-4">
            Capabilities
          </span>
        </h2>
      </div>

      {/* Staggered Asymmetric Frieze Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 max-w-5xl w-full mx-auto z-10">
        
        {/* Column 1: Creative Tech */}
        <div className="frieze-column flex flex-col gap-6 lg:translate-y-0 opacity-0" style={{ willChange: 'transform, opacity' }}>
          <div className="border-b border-white/5 pb-4 mb-4">
            <h3 className="font-serif italic text-text-primary text-xl tracking-wide flex justify-between items-center">
              <span>01 / Creative Tech</span>
              <span className="text-[10px] font-mono uppercase text-accent/50 tracking-widest">Interactive</span>
            </h3>
          </div>
          <div className="flex flex-col gap-8">
            {creativeTech.map((skill) => (
              <EngravedItem
                key={skill.id}
                skill={skill}
                isActive={activeId === skill.id}
                onHover={() => setActiveId(skill.id)}
                onLeave={() => setActiveId(null)}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setActiveId(prev => prev === skill.id ? null : skill.id);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Column 2: Engineering Core */}
        <div className="frieze-column flex flex-col gap-6 lg:translate-y-16 opacity-0" style={{ willChange: 'transform, opacity' }}>
          <div className="border-b border-white/5 pb-4 mb-4">
            <h3 className="font-serif italic text-text-primary text-xl tracking-wide flex justify-between items-center">
              <span>02 / Engineering Core</span>
              <span className="text-[10px] font-mono uppercase text-accent/50 tracking-widest">Structures</span>
            </h3>
          </div>
          <div className="flex flex-col gap-8">
            {engineeringCore.map((skill) => (
              <EngravedItem
                key={skill.id}
                skill={skill}
                isActive={activeId === skill.id}
                onHover={() => setActiveId(skill.id)}
                onLeave={() => setActiveId(null)}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setActiveId(prev => prev === skill.id ? null : skill.id);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Backend & Systems */}
        <div className="frieze-column flex flex-col gap-6 lg:translate-y-32 opacity-0" style={{ willChange: 'transform, opacity' }}>
          <div className="border-b border-white/5 pb-4 mb-4">
            <h3 className="font-serif italic text-text-primary text-xl tracking-wide flex justify-between items-center">
              <span>03 / Backend & Systems</span>
              <span className="text-[10px] font-mono uppercase text-accent/50 tracking-widest">Arcane Arc</span>
            </h3>
          </div>
          <div className="flex flex-col gap-8">
            {backendSystems.map((skill) => (
              <EngravedItem
                key={skill.id}
                skill={skill}
                isActive={activeId === skill.id}
                onHover={() => setActiveId(skill.id)}
                onLeave={() => setActiveId(null)}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setActiveId(prev => prev === skill.id ? null : skill.id);
                  }
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Structural bottom spacing spacer */}
      <div className="h-20 lg:h-32" />
    </section>
  );
}

interface EngravedItemProps {
  skill: SkillItem;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function EngravedItem({ skill, isActive, onHover, onLeave, onClick }: EngravedItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024 || !itemRef.current) return;
    const el = itemRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const px = x / (rect.width / 2);
    const py = y / (rect.height / 2);
    
    gsap.to(el, {
      rotateY: px * 7, // slight 3D perspective tilt
      rotateX: -py * 7,
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    onLeave();
    if (!itemRef.current) return;
    gsap.to(itemRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  return (
    <div
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative py-4 px-5 flex flex-col justify-start select-none cursor-none transition-all duration-500 group"
      style={{
        transformStyle: "preserve-3d",
      }}
      data-interactive="true"
    >
      {/* Background left accent line to indicate selected item (Index Ledger style) */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-[1.5px] transition-all duration-500
          ${isActive ? "bg-accent/40 scale-y-100" : "bg-white/5 scale-y-75 opacity-20"}`}
      />

      <div className="flex flex-col gap-2" style={{ transform: "translateZ(15px)" }}>
        <div className="flex items-baseline gap-2.5">
          {/* Section Roman tag */}
          <span className={`font-serif italic text-xs transition-colors duration-500 shrink-0 ${isActive ? "text-accent" : "text-white/20"}`}>
            {skill.roman}.
          </span>
          
          {/* Capability Title (Solid elegant Outfit font) */}
          <h4 
            className={`font-sans text-[15px] md:text-base font-bold uppercase tracking-[0.16em] transition-all duration-500 leading-none frieze-title
              ${isActive 
                ? "text-accent drop-shadow-[0_0_8px_rgba(232,168,74,0.15)]" 
                : "text-white/50"
              }`}
          >
            {skill.name}
          </h4>
        </div>
      </div>
    </div>
  );
}
