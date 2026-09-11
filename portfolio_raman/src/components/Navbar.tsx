"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Command } from "lucide-react";
import { navLinks, personal } from "@/lib/data";
import { useLenis } from "@/lib/lenis-context";
import { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";
import MagneticButton from "@/components/MagneticButton";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="font-mono text-sm font-medium tracking-tight text-foreground"
        >
          {personal.name
            .split(" ")
            .map((w) => w[0])
            .join("")}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 md:flex">
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <kbd className="section-label">K</kbd>
          </button>

          <ThemeToggle />

          <MagneticButton>
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-accent bg-accent px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Resume <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </MagneticButton>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="text-foreground"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 pb-6 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="block text-base text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-foreground"
              >
                Resume <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  );
}
