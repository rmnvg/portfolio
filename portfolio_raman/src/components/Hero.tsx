"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Search } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";
import HeroSceneClient from "@/components/three/HeroSceneClient";
import ScrambleText from "@/components/ScrambleText";
import MagneticButton from "@/components/MagneticButton";
import PipelineViz from "@/components/PipelineViz";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-12"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_30%_10%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 -left-20 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[130px]" />

      {/* 3D presence, ambient rather than centrepiece */}
      <div className="hero-orb pointer-events-none absolute -right-44 top-[38%] hidden h-[30rem] w-[30rem] -translate-y-1/2 lg:block">
        <HeroSceneClient />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="section-label mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted uppercase"
        >
          <span className="text-foreground">
            <ScrambleText text={personal.name} startDelay={200} />
          </span>
          <span className="text-border">/</span>
          <span>Software Engineer · Gen AI</span>
          <span className="text-border">/</span>
          <span>{personal.location}</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-display max-w-4xl text-[2.9rem] leading-[0.99] text-foreground sm:text-[3.9rem] lg:text-[4.7rem]"
        >
          2.5 million documents a year,{" "}
          <em className="text-accent not-italic">
            classified without a human.
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          I build the retrieval and LLM systems behind numbers like that —
          and the guardrails that keep them auditable when they are wrong.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease }}
          className="mt-8 flex flex-wrap items-center gap-3.5"
        >
          <MagneticButton>
            <a
              href="#ask"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              <Search className="h-4 w-4" />
              Ask my résumé
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              The PDF <ArrowUpRight className="h-4 w-4" />
            </a>
          </MagneticButton>

          <div className="flex items-center gap-2.5">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <LinkedinIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={`mailto:${personal.email}`}
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-[18px] w-[18px]" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease }}
          className="mt-11"
        >
          <PipelineViz />
        </motion.div>
      </div>
    </section>
  );
}
