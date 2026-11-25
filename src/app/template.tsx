"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const ROUTE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Per-navigation arrival for subpages (/resume, 404).
 * Home (/) skips the outer fade so Hero's opening choreography plays at full contrast from frame 0.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: ROUTE_EASE }}
    >
      {children}
    </motion.div>
  );
}
