"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // No entrance animation, and no hidden initial state to recover from.
  if (reduce) {
    return (
      <div data-reveal="static" className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      // globals.css force-reveals [data-reveal] under prefers-reduced-motion,
      // so content is never left stranded at opacity:0 if this hook lags the
      // media query on first paint.
      data-reveal="motion"
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
