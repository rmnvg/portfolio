"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("cursor-none-custom");

    const ring = { x: 0, y: 0 };
    let mouseX = 0;
    let mouseY = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      ring.x += (mouseX - ring.x) * 0.18;
      ring.y += (mouseY - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button']"));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("cursor-none-custom");
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-accent-2"
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-accent transition-[width,height,opacity] duration-200 ease-out ${
          hovering ? "h-11 w-11 bg-accent/10" : "h-7 w-7"
        }`}
      />
    </>
  );
}
