import { GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ParticleAvatar from "@/components/ParticleAvatar";
import Counter from "@/components/Counter";
import { education, personal, stats } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading index="01" label="About" title="Who I am" />

        <div className="mb-16 flex flex-col items-center gap-16 lg:flex-row lg:items-start">
          <Reveal delay={0.02} className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/25 to-accent-2/15 blur-3xl" />
              <div className="relative">
                <ParticleAvatar src="/raman.png" size={260} gap={3.2} />
              </div>
              <p className="section-label mt-4 text-center text-[11px] text-muted">
                hover to interact
              </p>
            </div>
          </Reveal>

          <div className="flex-1">
            <Reveal delay={0.08}>
              <p className="text-lg leading-relaxed text-muted">
                {personal.summary}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-semibold text-gradient sm:text-3xl">
                      <Counter value={s.value} />
                    </p>
                    <p className="mt-1 text-xs text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-sm text-accent">
              <GraduationCap className="h-4 w-4" />
              <span className="section-label uppercase">Education</span>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {education.map((e) => (
                <div key={e.school} className="border-l-2 border-border pl-4">
                  <p className="text-sm font-medium text-foreground">
                    {e.school}
                  </p>
                  <p className="mt-1 text-sm text-muted">{e.degree}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>{e.period}</span>
                    <span className="font-mono text-accent-2">
                      {e.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
