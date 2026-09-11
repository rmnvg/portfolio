"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "booting portfolio.ai",
  "loading gen-ai systems",
  "compiling experience graph",
  "ready",
];

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("intro-seen");
    const duration = alreadySeen ? 0 : 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct =
        duration === 0 ? 100 : Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setLineIndex(Math.min(LINES.length - 1, Math.floor((pct / 100) * LINES.length)));
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("intro-seen", "1");
        setTimeout(() => setVisible(false), alreadySeen ? 0 : 250);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          <div className="section-label mb-6 text-sm text-accent-2">
            {LINES[lineIndex]}
            <span className="animate-pulse">_</span>
          </div>
          <div className="h-px w-56 overflow-hidden bg-border">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-2"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="section-label mt-4 text-xs text-muted">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
