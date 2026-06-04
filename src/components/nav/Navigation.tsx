"use client";

import React, { useState, useEffect } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useChapterTracker } from "@/hooks/useChapterTracker";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

const CHAPTERS = [
  { id: 1, name: "The Inscription", numeral: "I" },
  { id: 2, name: "The Origin", numeral: "II" },
  { id: 3, name: "The Arsenal", numeral: "III" },
  { id: 4, name: "The Relics", numeral: "IV" },
  { id: 5, name: "The Summons", numeral: "V" },
];

export default function Navigation() {
  const progress = useScrollProgress();
  const activeChapter = useChapterTracker();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(".mobile-menu", { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".menu-item", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(".mobile-menu", { autoAlpha: 0, duration: 0.4, ease: "power2.in" });
    }
  }, [menuOpen]);

  const scrollToChapter = (id: number) => {
    setMenuOpen(false);
    const element = document.querySelector(`[data-chapter="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Left-edge progress bar */}
      <div className="fixed left-0 top-0 bottom-0 w-[2px] bg-bg-raised z-[100] hidden md:block">
        <div 
          className="w-full bg-ember origin-top" 
          style={{ transform: `scaleY(${progress})` }} 
        />
      </div>

      {/* Top Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled ? "bg-bg-grimoire/80 backdrop-blur-md py-4" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo / Sigil */}
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => scrollToChapter(1)}
          >
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" className="group-hover:drop-shadow-[0_0_8px_rgba(200,130,42,0.6)] transition-all">
              <path d="M 80 20 L 20 20 L 20 50 L 80 50 L 80 80 L 20 80" stroke="var(--ember)" strokeWidth="4" strokeLinecap="square" />
            </svg>
            <span className="text-small font-semibold tracking-wider text-ink-primary group-hover:text-ember transition-colors">
              SHIVAM DIWAN
            </span>
          </div>

          {/* Desktop Chapters */}
          <nav className="hidden md:flex items-center gap-8">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => scrollToChapter(chapter.id)}
                className={`text-micro transition-all ${
                  activeChapter === chapter.id 
                    ? "text-ember scale-110" 
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {chapter.numeral}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-ink-primary p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu invisible fixed inset-0 z-[90] bg-bg-void/95 backdrop-blur-lg flex flex-col justify-center px-8">
        <nav className="flex flex-col gap-8">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
              className="menu-item text-left flex items-center gap-6"
            >
              <span className="text-mono text-ember text-sm">{chapter.numeral}</span>
              <span className={`text-display ${activeChapter === chapter.id ? "text-ink-primary" : "text-ink-secondary"}`}>
                {chapter.name}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
