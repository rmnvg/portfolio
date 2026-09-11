"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CornerDownLeft,
  FileDown,
  Hash,
  Mail,
  Search,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useLenis } from "@/lib/lenis-context";
import { personal } from "@/lib/data";
import { burstConfetti } from "@/lib/confetti";

type CommandAction = {
  id: string;
  label: string;
  group: string;
  icon: ReactNode;
  perform: () => void;
};

export const OPEN_PALETTE_EVENT = "open-command-palette";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lenis = useLenis();

  const goTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -72 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
      setOpen(false);
    },
    [lenis],
  );

  const actions = useMemo<CommandAction[]>(
    () => [
      { id: "nav-about", label: "Go to About", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("about") },
      { id: "nav-experience", label: "Go to Experience", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("experience") },
      { id: "nav-projects", label: "Go to Projects", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("projects") },
      { id: "nav-github", label: "Go to Open Source", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("github") },
      { id: "nav-skills", label: "Go to Skills", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("skills") },
      { id: "nav-contact", label: "Go to Contact", group: "Navigate", icon: <Hash className="h-4 w-4" />, perform: () => goTo("contact") },
      {
        id: "action-email",
        label: `Copy email — ${personal.email}`,
        group: "Actions",
        icon: <Mail className="h-4 w-4" />,
        perform: () => {
          navigator.clipboard.writeText(personal.email).catch(() => {});
          burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
          setOpen(false);
        },
      },
      {
        id: "action-resume",
        label: "Download résumé",
        group: "Actions",
        icon: <FileDown className="h-4 w-4" />,
        perform: () => {
          window.open(personal.resumeUrl, "_blank");
          setOpen(false);
        },
      },
      {
        id: "action-github",
        label: "Open GitHub profile",
        group: "Actions",
        icon: <GithubIcon className="h-4 w-4" />,
        perform: () => {
          window.open(personal.github, "_blank");
          setOpen(false);
        },
      },
      {
        id: "action-linkedin",
        label: "Open LinkedIn profile",
        group: "Actions",
        icon: <LinkedinIcon className="h-4 w-4" />,
        perform: () => {
          window.open(personal.linkedin, "_blank");
          setOpen(false);
        },
      },
    ],
    [goTo],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  const openPalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpenEvent = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, [open, openPalette]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onQueryChange = (v: string) => {
    setQuery(v);
    setActiveIndex(0);
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.perform();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[150] flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onListKeyDown}
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
              <kbd className="section-label rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">
                esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  No results.
                </p>
              )}
              {filtered.map((action, i) => (
                <button
                  key={action.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={action.perform}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-surface-2 text-foreground"
                      : "text-muted"
                  }`}
                >
                  <span className="text-accent">{action.icon}</span>
                  <span className="flex-1">{action.label}</span>
                  {i === activeIndex && (
                    <CornerDownLeft className="h-3.5 w-3.5 text-muted" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
