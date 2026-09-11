"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#";

export default function ScrambleText({
  text,
  className,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      const id = window.setTimeout(() => setDisplay(text), 0);
      return () => window.clearTimeout(id);
    }

    const reveals = text
      .split("")
      .map(() => 3 + Math.floor(Math.random() * 10));
    const maxReveal = Math.max(...reveals, 1);
    let frame = 0;
    let intervalId = 0;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " ") {
            out += " ";
          } else if (frame >= reveals[i]) {
            out += ch;
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplay(out);
        frame++;
        if (frame > maxReveal) {
          window.clearInterval(intervalId);
          setDisplay(text);
        }
      }, 45);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, startDelay]);

  return <span className={className}>{display}</span>;
}
