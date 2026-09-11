"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { personal } from "@/lib/data";
import { burstConfetti } from "@/lib/confetti";

function getDelhiTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number;
    const timeoutId = window.setTimeout(() => {
      setTime(getDelhiTime());
      intervalId = window.setInterval(() => setTime(getDelhiTime()), 1000);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const copyEmail = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      burstConfetti(e.clientX, e.clientY);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore, mailto link still works
    }
  };

  const onMailClick = (e: MouseEvent<HTMLAnchorElement>) => {
    burstConfetti(e.clientX, e.clientY);
  };

  return (
    <section id="contact" className="relative border-t border-border py-24">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-accent/10 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal className="mb-4 flex items-center justify-center gap-2 text-xs text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-2" />
          </span>
          <span className="section-label">
            {time ? `${time} IST · ${personal.location}` : personal.location}
          </span>
        </Reveal>

        <Reveal delay={0.02}>
          <p className="section-label mb-4 text-xs text-accent uppercase">
            08 — Contact
          </p>
          <h2 className="font-display text-4xl leading-[1.03] text-foreground sm:text-6xl">
            Let&rsquo;s build something{" "}
            <em className="text-accent not-italic">worth shipping.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            I&rsquo;m always open to conversations about Gen AI systems,
            interesting engineering problems, or new opportunities. Reach out
            — I usually reply within a day.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton strength={0.25}>
            <a
              href={`mailto:${personal.email}`}
              onClick={onMailClick}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              <Mail className="h-4 w-4" />
              {personal.email}
            </a>
          </MagneticButton>
          <button
            onClick={copyEmail}
            aria-label="Copy email address"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent-2" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </Reveal>

        <Reveal
          delay={0.18}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
