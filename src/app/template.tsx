"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ROUTE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Per-navigation route arrival wrapper for /, /resume, and 404.
 * Runs pure GPU opacity + subtle translateY without forcing page files into Client Components.
 */
export default function Template({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: ROUTE_EASE }}
    >
      {children}
    </motion.div>
  );
}
