"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CHAPTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ScrollHeadingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Masked baseline-rise for section headings — stages each chapter before its body arrives.
 */
export function ScrollHeading({
  children,
  className,
  delay = 0,
}: ScrollHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
      className={`overflow-hidden pb-0.5 ${className ?? ""}`}
    >
      <motion.div
        variants={{
          hidden: { y: "105%", opacity: 0 },
          visible: {
            y: "0%",
            opacity: 1,
            transition: { duration: 0.62, delay, ease: CHAPTER_EASE },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number | "some" | "all";
  variant?: "rise" | "wipe" | "card";
}

/**
 * Element-level GPU scroll reveal (never wrap whole sections in one block).
 * - "rise": subtle vertical settle (individual rows, bullets, copy)
 * - "wipe": left-to-right clip reveal (hairline rows, badges)
 * - "card": subtle depth pop-in (self-contained cards like Jukebox deck)
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 14,
  amount = "some",
  variant = "rise",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "wipe") {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        className={className}
      >
        <motion.div
          variants={{
            hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.25 },
            visible: {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              transition: { duration: 0.64, delay, ease: CHAPTER_EASE },
            },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.965 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount }}
        transition={{ duration: 0.68, delay, ease: CHAPTER_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.58, delay, ease: CHAPTER_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
