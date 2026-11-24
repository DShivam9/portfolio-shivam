"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CHAPTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}

/**
 * Pure GPU-composited chapter arrival (opacity + translateY + subtle scale, zero blur).
 * Fires once per visit so scrolling back up never hides content.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 20,
  amount = 0.14,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.988 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: "0px 0px -48px 0px" }}
      transition={{ duration: 0.62, delay, ease: CHAPTER_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
