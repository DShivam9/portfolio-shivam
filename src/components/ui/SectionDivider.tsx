"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ARCHITECT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Crosshair({
  className,
  reduceMotion,
}: {
  className: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.span
      aria-hidden="true"
      variants={
        reduceMotion
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
            hidden: { opacity: 0, scale: 0.3, rotate: -45 },
            visible: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                duration: 0.48,
                delay: 0.24,
                ease: ARCHITECT_EASE,
              },
            },
          }
      }
      className={`pointer-events-none absolute z-10 flex h-2.5 w-2.5 items-center justify-center ${className}`}
    >
      <span className="absolute h-px w-full bg-border-strong" />
      <span className="absolute h-full w-px bg-border-strong" />
    </motion.span>
  );
}

export function InterlockingPattern({ className = "" }: { className?: string }) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="240"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="var(--divider-stroke)"
            strokeWidth="1"
            strokeLinejoin="miter"
          >
            {/* Cluster 1: upright L + nested inverted stepped-L + lower-right L */}
            <path d="M 3 8 H 14 V 23 H 44 V 33 H 3 Z" />
            <path d="M 18 3 H 78 V 12 H 44 V 19 H 18 Z" />
            <path d="M 48 16 H 78 V 33 H 67 V 25 H 48 Z" />

            {/* Cluster 2: tall left hook + stepped lower bar + top-right inverted L */}
            <path d="M 82 3 H 116 V 13 H 94 V 33 H 82 Z" />
            <path d="M 98 17 H 126 V 24 H 158 V 33 H 98 Z" />
            <path d="M 120 3 H 158 V 20 H 130 V 13 H 120 Z" />

            {/* Cluster 3: top hooked bar + stepped bottom L + right vertical wrap */}
            <path d="M 162 3 H 214 V 19 H 202 V 12 H 162 Z" />
            <path d="M 162 16 H 198 V 24 H 222 V 33 H 162 Z" />
            <path d="M 218 3 H 239 V 33 H 226 V 20 H 218 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function SectionDivider() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
      className="relative w-full bg-bg"
    >
      {/* Top & bottom hairline rules drawing outward from center */}
      <motion.span
        variants={
          shouldReduceMotion
            ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
            : {
              hidden: { scaleX: 0, opacity: 0 },
              visible: {
                scaleX: 1,
                opacity: 1,
                transition: { duration: 0.72, ease: ARCHITECT_EASE },
              },
            }
        }
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-border"
      />
      <motion.span
        variants={
          shouldReduceMotion
            ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
            : {
              hidden: { scaleX: 0, opacity: 0 },
              visible: {
                scaleX: 1,
                opacity: 1,
                transition: {
                  duration: 0.72,
                  delay: 0.06,
                  ease: ARCHITECT_EASE,
                },
              },
            }
        }
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center bg-border"
      />

      <div className="rail-reveal relative mx-auto h-9 max-w-5xl border-x border-border">
        {/* Interlocking geometric pattern unfurling from center to both rails */}
        <motion.div
          variants={
            shouldReduceMotion
              ? { hidden: { opacity: 0.6 }, visible: { opacity: 0.6 } }
              : {
                hidden: {
                  clipPath: "inset(0% 50% 0% 50%)",
                  opacity: 0,
                },
                visible: {
                  clipPath: "inset(0% 0% 0% 0%)",
                  opacity: 0.6,
                  transition: {
                    duration: 0.85,
                    delay: 0.12,
                    ease: ARCHITECT_EASE,
                  },
                },
              }
          }
          className="pointer-events-none absolute inset-0"
        >
          <InterlockingPattern />
        </motion.div>

        <Crosshair
          reduceMotion={shouldReduceMotion}
          className="-left-px -top-px -translate-x-1/2 -translate-y-1/2"
        />
        <Crosshair
          reduceMotion={shouldReduceMotion}
          className="-right-px -top-px translate-x-1/2 -translate-y-1/2"
        />
        <Crosshair
          reduceMotion={shouldReduceMotion}
          className="-bottom-px -left-px -translate-x-1/2 translate-y-1/2"
        />
        <Crosshair
          reduceMotion={shouldReduceMotion}
          className="-bottom-px -right-px translate-x-1/2 translate-y-1/2"
        />
      </div>
    </motion.div>
  );
}
