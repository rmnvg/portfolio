import { GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { education, personal, stats } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading index="01" label="About" title="Who I am" />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal delay={0.05}>
            <p className="text-lg leading-relaxed text-muted">
              {personal.summary}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold text-gradient sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-center gap-2 text-sm text-accent">
                <GraduationCap className="h-4 w-4" />
                <span className="section-label uppercase">Education</span>
              </div>
              <div className="space-y-6">
                {education.map((e) => (
                  <div
                    key={e.school}
                    className="border-l-2 border-border pl-4"
                  >
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
      </div>
    </section>
  );
}
