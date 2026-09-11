"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { personal } from "@/lib/data";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore, mailto link still works
    }
  };

  return (
    <section id="contact" className="relative border-t border-border py-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-accent/10 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="section-label mb-4 text-xs text-accent uppercase">
            06 — Contact
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Let&rsquo;s build something{" "}
            <span className="text-gradient">worth shipping.</span>
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
          <a
            href={`mailto:${personal.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            <Mail className="h-4 w-4" />
            {personal.email}
          </a>
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
