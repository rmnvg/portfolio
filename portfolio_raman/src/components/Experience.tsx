import { Briefcase } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="03"
          label="Experience"
          title="Where I've worked"
        />

        <div className="space-y-10">
          {experience.map((exp, i) => (
            <Reveal key={exp.company} delay={i * 0.08}>
              <div className="grid grid-cols-1 gap-6 offset-shadow-sm rounded-lg border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[260px_1fr]">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-accent">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {exp.company}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{exp.role}</p>
                  <p className="section-label mt-3 text-xs text-accent-2 uppercase">
                    {exp.period}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="section-label rounded border border-border px-2 py-1 text-[10px] text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="space-y-3">
                  {exp.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
