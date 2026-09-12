"use client";

import { useEffect, useState } from "react";

/**
 * Reports which section id currently occupies the middle band of the viewport.
 * The asymmetric rootMargin collapses the viewport to a thin horizontal line so
 * exactly one section is intersecting at a time.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    // Above the first section there is no active link.
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
