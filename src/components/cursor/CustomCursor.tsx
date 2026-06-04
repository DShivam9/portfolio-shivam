"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const core = coreRef.current;
    const aura = auraRef.current;
    if (!core || !aura) return;

    gsap.set([core, aura], { xPercent: -50, yPercent: -50 });

    // Subtle breathing pulse on the aura
    gsap.to(aura, {
      scale: 1.15,
      opacity: 0.2,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Constant slow rotation on the core star
    gsap.to(core, {
      rotation: 360,
      duration: 15,
      repeat: -1,
      ease: "none"
    });

    // ── Movement ──
    const moveCursor = (e: MouseEvent) => {
      gsap.to(core, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
      gsap.to(aura, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power3.out" });
    };

    // ── Helper: find closest interactive ancestor ──
    const findInteractive = (target: EventTarget | null): Element | null => {
      if (!target || !(target instanceof Element)) return null;
      return target.closest('a, button, [data-interactive="true"], input, textarea, select');
    };

    // ── Hover states ──
    let currentHovered: Element | null = null;

    const activateHover = (el: Element) => {
      const cursorType = el.getAttribute("data-cursor-type");

      if (cursorType === "logo") {
        gsap.to(core, { scale: 1.4, duration: 0.4, ease: "expo.out" });
        gsap.to(core, { rotation: "+=360", duration: 0.8, ease: "power2.out", overwrite: false });
        gsap.to(aura, { scale: 2, opacity: 0.4, duration: 0.5, ease: "expo.out" });
      } else if (cursorType === "project") {
        gsap.to(core, { scale: 1.3, duration: 0.4, ease: "expo.out" });
        gsap.to(aura, { scale: 2.2, opacity: 0.35, duration: 0.5, ease: "expo.out" });
      } else {
        // Default for all interactive elements
        gsap.to(core, { scale: 0.75, duration: 0.3, ease: "expo.out" });
        gsap.to(aura, { scale: 1.6, opacity: 0.35, duration: 0.4, ease: "expo.out" });
      }

      // Star turns gold on any hover
      gsap.to(".cursor-star path", { fill: "#E8A84A", duration: 0.3 });
      gsap.to(".cursor-glow", { opacity: 0.7, scale: 1.3, duration: 0.4 });
    };

    const deactivateHover = () => {
      gsap.to(core, { scale: 1, duration: 0.45, ease: "expo.out" });
      gsap.to(aura, { scale: 1, opacity: 0.15, duration: 0.45, ease: "power2.out" });
      gsap.to(".cursor-star path", { fill: "#ffffff", duration: 0.4 });
      gsap.to(".cursor-glow", { opacity: 0.5, scale: 1, duration: 0.4 });
    };

    // ── Event delegation — works on ALL elements, even dynamically added ──
    const onMouseOver = (e: MouseEvent) => {
      const interactive = findInteractive(e.target);
      if (interactive && interactive !== currentHovered) {
        currentHovered = interactive;
        activateHover(interactive);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!currentHovered) return;
      const related = e.relatedTarget;
      // Only deactivate if we're leaving the interactive element entirely
      if (!related || !currentHovered.contains(related as Node)) {
        currentHovered = null;
        deactivateHover();
      }
    };

    // ── Click ──
    const onMouseDown = () => {
      gsap.to(core, { scale: 0.5, duration: 0.12, ease: "power3.out" });
      gsap.to(aura, { scale: 0.7, opacity: 0.5, duration: 0.12, ease: "power3.out" });
    };

    const onMouseUp = () => {
      gsap.to(core, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.35)" });
      gsap.to(aura, { scale: 1, opacity: 0.15, duration: 0.5, ease: "elastic.out(1, 0.35)" });
    };

    // ── Bind at document level ──
    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] mix-blend-screen">
      {/* Ethereal Aura */}
      <div
        ref={auraRef}
        className="absolute top-0 left-0 w-20 h-20 pointer-events-none flex items-center justify-center overflow-visible opacity-15"
      >
        <div className="w-8 h-8 bg-[#E8A84A] rounded-full blur-[22px]" />
      </div>

      {/* Core Star — slightly larger */}
      <div
        ref={coreRef}
        className="absolute top-0 left-0 w-12 h-12 pointer-events-none flex items-center justify-center overflow-visible"
      >
        <div className="cursor-glow absolute w-4 h-4 bg-white rounded-full blur-[10px] opacity-50" />
        <svg viewBox="0 0 100 100" className="cursor-star w-7 h-7 absolute drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
          <path d="M 50 5 Q 50 50 5 50 Q 50 50 50 95 Q 50 50 95 50 Q 50 50 50 5 Z" fill="#ffffff" />
        </svg>
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_#fff]" />
      </div>
    </div>
  );
}
