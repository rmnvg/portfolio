"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// Kept in sync with the inline boot script in layout.tsx.
function timeOfDayTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 9 && hour < 18 ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const current = document.documentElement.getAttribute(
        "data-theme",
      ) as Theme | null;
      setTheme(current ?? timeOfDayTheme());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked — the attribute still applies for this session
    }
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      title={theme === "light" ? "after hours" : "daybook"}
      className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent md:h-9 md:w-9"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
