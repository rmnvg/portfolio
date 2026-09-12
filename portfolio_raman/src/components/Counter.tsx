"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

function parseValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return null;
  const [, numeric, suffix] = match;
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  return { target: parseFloat(numeric), suffix, decimals };
}

export default function Counter({
  value,
  duration = 1.4,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  // Render the true figure on the server and on the first client paint, so the
  // markup never ships a literal "0" to crawlers or to users without JS.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parsed = parseValue(value);
    if (!parsed || reduce) return;

    // Below the fold there is nothing on screen to flash, so arming the zero
    // state is invisible. Deferred a frame to keep it out of the effect body.
    if (!inView) {
      const armId = requestAnimationFrame(() =>
        setDisplay(`${(0).toFixed(parsed.decimals)}${parsed.suffix}`),
      );
      return () => cancelAnimationFrame(armId);
    }

    const { target, suffix, decimals } = parsed;
    const start = performance.now();
    const durationMs = duration * 1000;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${(target * eased).toFixed(decimals)}${suffix}`);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return <span ref={ref}>{display}</span>;
}
