"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  id: string;
  name: string;
  desc: string;
  color: string;
}

interface Category {
  title: string;
  skills: Skill[];
}

const CATEGORIES: Category[] = [
  {
    title: "Creative Tech",
    skills: [
      { id: "threejs", name: "Three.js", desc: "Interactive 3D scene graphs and WebGL graphics maps.", color: "#FFFFFF" },
      { id: "webgl", name: "WebGL", desc: "GPU pipeline access and low-level custom render buffers.", color: "#990000" },
      { id: "gsap", name: "GSAP", desc: "High-frequency cinematic scroll and timeline tweening physics.", color: "#88CE02" },
      { id: "framer", name: "Framer Motion", desc: "Declarative spring physics and custom route transitions.", color: "#F024B6" },
      { id: "glsl", name: "GLSL Shaders", desc: "Custom fragment shaders, procedural noise, and raymarching.", color: "#E8A84A" }
    ]
  },
  {
    title: "Engineering Core",
    skills: [
      { id: "react", name: "React", desc: "Robust declarative architectures and optimized hook loops.", color: "#61DAFB" },
      { id: "nextjs", name: "Next.js", desc: "Production App Router structures, SSR, and SSG rendering pipelines.", color: "#FFFFFF" },
      { id: "typescript", name: "TypeScript", desc: "Compile-time strict type safety and generic schemas.", color: "#3178C6" },
      { id: "tailwind", name: "Tailwind CSS", desc: "Utility-first design token configurations and theme states.", color: "#38BDF8" }
    ]
  },
  {
    title: "Backend & Systems",
    skills: [
      { id: "nodejs", name: "Node.js", desc: "Scalable event-driven event loop and REST/GraphQL APIs.", color: "#339933" },
      { id: "postgresql", name: "PostgreSQL", desc: "Relational database queries, indexing, and connection pools.", color: "#4169E1" },
      { id: "graphql", name: "GraphQL", desc: "Flexible type-safe query interfaces and schema batch optimizations.", color: "#E10098" },
      { id: "docker", name: "Docker", desc: "Isolated virtualization containers and microservice environments.", color: "#2496ED" }
    ]
  }
];

const Logo = ({ id, className }: { id: string; className?: string }) => {
  switch (id) {
    case "threejs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.8 19.8L12.24 1.2 1.68 19.8h21.12zM12.24 4.56l7.68 13.44H4.56L12.24 4.56zM12.24 8.4l3.84 6.72H8.4l3.84-6.72z" />
        </svg>
      );
    case "webgl":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-2h2v2zm0-4.5h-2V7.5h2V13z" />
        </svg>
      );
    case "gsap":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.2 2a10 10 0 1 0 10 10H12.2V2zm0 17.5V13.8h5.7a7.7 7.7 0 0 1-5.7 5.7zm0-7.7V4.2a7.7 7.7 0 0 1 5.7 5.7h-5.7z" />
        </svg>
      );
    case "framer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v12H12L0 0zm0 12h12l12 12H0V12z" />
        </svg>
      );
    case "glsl":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      );
    case "react":
      return (
        <svg className={className} viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </svg>
      );
    case "nextjs":
      return (
        <svg className={className} viewBox="0 0 128 128" fill="currentColor">
          <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.8 95.3L54.7 41.5V94h-8.2V34h8.2l41.6 52.8V34h8.2v61.3h-7.7z" />
        </svg>
      );
    case "typescript":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.38 0H1.62A1.62 1.62 0 0 0 0 1.62v20.76A1.62 1.62 0 0 0 1.62 24h20.76A1.62 1.62 0 0 0 24 22.38V1.62A1.62 1.62 0 0 0 22.38 0zM11.96 17c0 2.2-1.4 3.4-3.7 3.4-1.8 0-3.1-.9-3.7-2.3l1.8-1.1c.3.9.9 1.4 1.8 1.4.9 0 1.5-.4 1.5-1.3 0-2.3-4.5-1-4.5-4.5 0-2 1.5-3.3 3.7-3.3 1.6 0 2.8.7 3.4 2l-1.7 1.1c-.3-.7-.8-1.1-1.6-1.1-.8 0-1.3.4-1.3 1.1 0 2.1 4.5 1 4.5 4.6zm8.8-4.4h-2.9v7.8h-2.1v-7.8h-2.9v-1.8h7.9v1.8z" />
        </svg>
      );
    case "tailwind":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.518 15.039 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.282 14.963 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.55 2.676 5.512 2.676 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.482 8.963 12 6.001 12z" />
        </svg>
      );
    case "nodejs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-.34 0-.67.09-.96.26L2.61 7.15c-.6.35-.96.99-.96 1.69v9.78c0 .7.36 1.34.96 1.69l8.43 4.87c.29.17.62.26.96.26s.67-.09.96-.26l8.43-4.87c.6-.35.96-.99.96-1.69V8.84c0-.7-.36-1.34-.96-1.69l-8.43-4.87C12.67 2.09 12.34 2 12 2zm-1 5.35v1.27c-1.54.21-2.73 1.53-2.73 3.13 0 1.74 1.41 3.15 3.15 3.15 1.15 0 2.15-.61 2.69-1.52l1.09.63c-.76 1.28-2.15 2.14-3.78 2.14-2.43 0-4.4-1.97-4.4-4.4.01-2.27 1.72-4.14 3.98-4.4zm2 0c2.26.26 3.97 2.13 3.98 4.4 0 2.43-1.97 4.4-4.4 4.4-1.63 0-3.02-.86-3.78-2.14l1.09-.63c.54.91 1.54 1.52 2.69 1.52 1.74 0 3.15-1.41 3.15-3.15 0-1.6-1.19-2.92-2.73-3.13V7.35z" />
        </svg>
      );
    case "postgresql":
      return (
        <svg className={className} viewBox="0 0 64 64" fill="currentColor">
          <path d="M36 6c-3.3 0-6 2.7-6 6v4.3c-2.4-.6-5-.6-7.4 0V12c0-3.3-2.7-6-6-6S10.6 8.7 10.6 12v12.3c0 3.7 1.5 7.2 4.2 9.8l5.2 5.2v8.7H36V36l5.2-5.2c2.7-2.6 4.2-6.1 4.2-9.8V12c0-3.3-2.7-6-6-6z" />
        </svg>
      );
    case "graphql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7.75v11.5L12 25l10-5.75v-11.5L12 2zm0 3.2L19.8 9.7l-7.8 4.5-7.8-4.5 7.8-4.5zm0 13.6v-5.6l6.8-3.9v5.6L12 18.8zm-7.8-9.5l6.8 3.9v5.6l-6.8-3.9v-5.6z" />
        </svg>
      );
    case "docker":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 8.871h-1.996v1.996h1.996V8.871zM11.102 8.871H9.106v1.996h1.996V8.871zm-2.88 0H6.226v1.996h1.996V8.871zm-2.88 0H3.345v1.996h1.996V8.871zM11.102 6.012H9.106v1.996h1.996V6.012zm-2.88 0H6.226v1.996h1.996V6.012zm2.88-2.86H9.106v1.996h1.996V3.152zm6.226 5.719h-1.996v1.996h1.996V8.871zm2.88 0h-1.996v1.996h1.996V8.871zm-2.88-2.859h-1.996v1.996h1.996V6.012zm0-2.86h-1.996v1.996h1.996V3.152zm-12.87 9.84c-.03.228-.046.463-.046.702 0 3.865 3.197 7.009 7.126 7.009 3.513 0 6.471-2.5 7.01-5.772l-.089-.009c-.198-.02-.397-.034-.595-.044a1.73 1.73 0 0 1-1.39-1.282l-.053-.198H2.457z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Animate each category column with the site's signature blur-in + y rise
    const columns = containerRef.current.querySelectorAll(".skill-column");
    columns.forEach((col, colIdx) => {
      const header = col.querySelector(".skill-col-header");
      const items = col.querySelectorAll(".skill-item");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: col,
          start: "top 85%",
          end: "top 25%",
          scrub: 1.5,
        },
      });

      // Column header fades in first
      if (header) {
        tl.fromTo(header,
          { opacity: 0, y: 20, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, ease: "none", clearProps: "filter" },
          colIdx * 0.05
        );
      }

      // Each skill item reveals with stagger (matching About's line-by-line pattern)
      if (items.length > 0) {
        tl.fromTo(items,
          { opacity: 0, y: 18, filter: "blur(3px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 0.15,
            ease: "none",
            clearProps: "filter"
          },
          colIdx * 0.05 + 0.1
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full pb-32 md:pb-48 px-6 md:px-16 lg:px-24 flex flex-col items-center bg-transparent z-10"
    >

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(232,168,74,0.02)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 3-Column Grid Layout with GSAP Scroll-Scrubbed Reveals */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-16 pt-8 z-10">
        {CATEGORIES.map((cat, catIdx) => (
          <div key={catIdx} className="skill-column flex flex-col">

            {/* Category header */}
            <h3
              className="skill-col-header font-mono text-[10px] tracking-[0.25em] text-accent uppercase mb-8 border-b border-white/10 pb-3"
              style={{ opacity: 0, willChange: "transform, opacity, filter" }}
            >
              {cat.title}
            </h3>

            {/* List of skills */}
            <div className="flex flex-col gap-6">
              {cat.skills.map((skill) => {
                const isHovered = hoveredId === skill.id;
                const isAnyHovered = hoveredId !== null;
                const siblingFade = isAnyHovered && !isHovered;

                return (
                  <div
                    key={skill.id}
                    className="skill-item group relative flex items-start gap-4 cursor-none select-none"
                    style={{
                      opacity: 0,
                      willChange: "transform, opacity, filter",
                      transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                      ...(siblingFade ? { opacity: 0.35 } : {}),
                    }}
                    onMouseEnter={() => setHoveredId(skill.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    data-interactive="true"
                  >

                    {/* SVG logo icon on the left */}
                    <div
                      className="shrink-0 w-8 h-8 flex items-center justify-center"
                      style={{
                        color: isHovered ? skill.color : "rgba(255,255,255,0.22)",
                        filter: isHovered ? `drop-shadow(0 0 8px ${skill.color}33)` : "none",
                        transform: isHovered ? "scale(1.15) translateY(-2px)" : "scale(1) translateY(0)",
                        transition: "color 500ms cubic-bezier(0.16,1,0.3,1), filter 500ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.34,1.56,0.64,1)"
                      }}
                    >
                      <Logo id={skill.id} className="w-6 h-6" />
                    </div>

                    {/* Text content on the right */}
                    <div className="flex flex-col">
                      <h4
                        className="font-sans text-sm font-medium tracking-wide"
                        style={{
                          color: isHovered ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                          transition: "color 300ms cubic-bezier(0.16,1,0.3,1)"
                        }}
                      >
                        {skill.name}
                      </h4>
                      <p
                        className="font-light text-xs mt-1 max-w-[28ch]"
                        style={{
                          color: isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                          transition: "color 300ms cubic-bezier(0.16,1,0.3,1)"
                        }}
                      >
                        {skill.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
