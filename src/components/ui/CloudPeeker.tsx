"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const PEEKERS = [
  {
    id: "music",
    src: "/logos/cloud-music-listener.svg",
    alt: "Cloud listening to music",
    comment: "headphones on, shipping.",
    restClass: "translate-y-[32%] -rotate-6",
  },
  {
    id: "cool",
    src: "/logos/cool-cloud.svg",
    alt: "Cool cloud with sunglasses",
    comment: "sweating the 1px details.",
    restClass: "translate-y-[24%] rotate-3",
  },
  {
    id: "wink",
    src: "/logos/winking-cloud.svg",
    alt: "Winking cloud",
    comment: "I steer, AI speeds it up.",
    restClass: "translate-y-[34%] rotate-8",
  },
  {
    id: "smile",
    src: "/logos/smiling-green-cloud.svg",
    alt: "Smiling green cloud",
    comment: "always learning something new.",
    restClass: "translate-y-[28%] -rotate-3",
  },
] as const;

export function AboutCloudPeekers() {
  const [userId, setUserId] = useState<string | null>(null);
  const [autoId, setAutoId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nextIdxRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  const activeId = userId ?? autoId;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequential left-to-right peek: holds 2s, rests 1.6s, then advances to the next cloud
  useEffect(() => {
    if (shouldReduceMotion || !isInView || userId) return;

    let holdTimer: number | null = null;
    let nextTimer: number | null = null;

    const triggerPeek = () => {
      if (document.hidden) {
        nextTimer = window.setTimeout(triggerPeek, 2400);
        return;
      }
      const chosen = PEEKERS[nextIdxRef.current];
      nextIdxRef.current = (nextIdxRef.current + 1) % PEEKERS.length;
      setAutoId(chosen.id);

      holdTimer = window.setTimeout(() => {
        setAutoId(null);
        nextTimer = window.setTimeout(triggerPeek, 1600);
      }, 2000);
    };

    nextTimer = window.setTimeout(triggerPeek, 1800);

    return () => {
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      if (nextTimer !== null) window.clearTimeout(nextTimer);
    };
  }, [shouldReduceMotion, isInView, userId]);

  return (
    <div
      ref={wrapRef}
      aria-label="Cozy cloud companions"
      className="flex items-end gap-1.5 sm:gap-2"
    >
      {PEEKERS.map((peeker) => {
        const isOpen = activeId === peeker.id;
        return (
          <div
            key={peeker.id}
            className="relative"
            onMouseEnter={() => {
              setAutoId(null);
              setUserId(peeker.id);
            }}
            onMouseLeave={() => setUserId(null)}
          >
            {/* Own speech bubble popping cleanly above the peeking cloud */}
            <span
              role="tooltip"
              className={`pointer-events-none absolute bottom-full right-0 z-30 mb-2.5 whitespace-nowrap rounded-xl bg-surface-hover px-3 py-1.5 font-mono text-[11px] text-text transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-1.5 scale-95 opacity-0"
              }`}
            >
              {peeker.comment}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 rounded-[1px] bg-surface-hover"
              />
            </span>

            <button
              type="button"
              onFocus={() => {
                setAutoId(null);
                setUserId(peeker.id);
              }}
              onBlur={() => setUserId(null)}
              onClick={() => {
                setAutoId(null);
                setUserId((prev) => (prev === peeker.id ? null : peeker.id));
              }}
              aria-label={`${peeker.alt}: ${peeker.comment}`}
              className={`block cursor-pointer transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none ${
                isOpen ? "-translate-y-1 rotate-0 scale-105" : peeker.restClass
              }`}
            >
              <Image
                src={peeker.src}
                alt={peeker.alt}
                width={56}
                height={56}
                className="h-12 w-12 select-none object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] sm:h-14 sm:w-14"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
