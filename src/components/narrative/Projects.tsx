"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORKS = [
  {
    id: "01",
    title: "Campusly",
    description: "Decentralized school infrastructure orchestration with real-time mapping arrays.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: "02",
    title: "RetroRift",
    description: "High-performance retro console emulation running entirely in the browser.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
  },
  {
    id: "03",
    title: "SNIPCAST",
    description: "Privacy-first code snippet image generator running local client processing.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
  },
  {
    id: "04",
    title: "HEIC Studio",
    description: "Local drag-and-drop HEIC image conversion directly in the browser.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
  }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll(".project-row");
    rows.forEach((row) => {
      const text = row.querySelector(".project-text");
      const card = row.querySelector(".project-card");
      const elements = [text, card].filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Blur resolves smoothly but finishes before the movement does
      tl.fromTo(elements,
        { filter: "blur(3px)" },
        { filter: "blur(0px)", duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "filter" },
        0
      );

      // Position + opacity at cinematic pace
      tl.fromTo(elements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.4, stagger: 0.2, ease: "power4.out" },
        0
      );
    });
  }, { scope: containerRef });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-transparent text-white z-10"
      style={{ paddingTop: '4rem', paddingBottom: '6rem' }}
    >
      {/* Centered container — using inline styles to match About section's proven centering */}
      <div
        className="relative z-10 flex flex-col"
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', gap: '10rem' }}
      >
        {WORKS.map((work, index) => {
          const isOdd = index % 2 !== 0;

          return (
            <div
              key={work.id}
              className="project-row flex flex-col lg:flex-row items-center"
              style={{
                flexDirection: isOdd ? 'row-reverse' : 'row',
                gap: '4rem',
              }}
            >
              {/* ── Image Card ── */}
              <div
                className="project-card"
                style={{ width: '100%', maxWidth: '680px', flexShrink: 0, opacity: 0, willChange: 'transform, opacity, filter' }}
              >
                <div className="relative w-full overflow-hidden group bg-[#0a0a0b]" style={{ aspectRatio: '16 / 10', borderRadius: '10px' }}>
                  {/* Gold glow */}
                  <div
                    className="absolute inset-0 group-hover:shadow-[0_0_80px_rgba(232,168,74,0.12)] transition-shadow duration-[1.8s] ease-out z-10 pointer-events-none"
                    style={{ borderRadius: '10px', boxShadow: '0 4px 40px rgba(0,0,0,0.4), 0 0 40px rgba(232,168,74,0.03)' }}
                  />

                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="object-cover transition-all duration-[1.8s] ease-out group-hover:scale-[1.03]"
                    style={{ filter: 'brightness(0.5) contrast(1.1) grayscale(0.15)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(0.95) contrast(1.05) grayscale(0)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(0.5) contrast(1.1) grayscale(0.15)';
                    }}
                  />

                  {/* Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 100%)', borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* ── Text Column ── */}
              <div
                className="project-text flex flex-col justify-center"
                style={{ flex: '1 1 0', minWidth: 0, opacity: 0, willChange: 'transform, opacity, filter' }}
              >
                <h2
                  className="font-serif font-light uppercase text-white/90"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '0.04em', lineHeight: 1.15, marginBottom: '1rem' }}
                >
                  {work.title}
                </h2>

                <p
                  className="font-light text-white/40"
                  style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.05rem)', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2rem' }}
                >
                  {work.description}
                </p>

                <div className="flex items-center" style={{ gap: '2rem' }}>
                  <a
                    href={work.live}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-all duration-300"
                    style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}
                  >
                    View Project
                  </a>
                  <a
                    href={work.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-all duration-300"
                    style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Projects — premium CTA */}
      <div
        className="flex justify-center"
        style={{ marginTop: '8rem', paddingBottom: '2rem' }}
      >
        <Link
          href="/projects"
          className="group relative flex items-center overflow-hidden transition-all duration-500"
          style={{
            gap: '1rem',
            fontSize: '12px',
            letterSpacing: '0.25em',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            padding: '1rem 2.5rem',
            borderRadius: '100px',
            border: '1px solid rgba(232,168,74,0.15)',
            background: 'rgba(232,168,74,0.03)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(232,168,74,0.4)';
            e.currentTarget.style.background = 'rgba(232,168,74,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(232,168,74,0.1), inset 0 0 30px rgba(232,168,74,0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(232,168,74,0.15)';
            e.currentTarget.style.background = 'rgba(232,168,74,0.03)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Shimmer sweep on hover */}
          <span
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(232,168,74,0.08), transparent)',
            }}
          />
          <span className="relative z-10">All Projects</span>
          <span
            className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            style={{ color: 'var(--color-accent)', opacity: 0.6 }}
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
