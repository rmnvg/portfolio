import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  PenLine,
  Users,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import { achievements, type Achievement } from "@/lib/data";

const ICONS: Record<Achievement["kind"], LucideIcon> = {
  code: Code2,
  exam: GraduationCap,
  leadership: Users,
  teaching: Trophy,
  writing: PenLine,
};

export default function Achievements() {
  const featured = achievements.find((a) => a.featured);
  const rest = achievements.filter((a) => !a.featured);

  return (
    <section id="achievements" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="07"
          label="Achievements"
          title="Highlights along the way"
        />

        {featured && (
          <Reveal className="mb-6">
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group offset-shadow-sm tint-accent flex flex-col gap-6 rounded-lg border p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-8"
            >
              <div className="flex items-baseline gap-3 sm:w-56 sm:shrink-0 sm:flex-col sm:items-start sm:gap-1">
                <p className="text-gradient text-4xl font-semibold sm:text-5xl">
                  <Counter value={featured.metric} />
                </p>
                <p className="section-label text-[11px] text-muted uppercase">
                  {featured.caption}
                </p>
              </div>

              <p className="flex-1 text-base leading-relaxed text-foreground/85">
                {featured.text}
              </p>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, i) => {
            const Icon = ICONS[item.kind];
            return (
              <Reveal key={item.text} delay={i * 0.05} className="h-full">
                <div className="offset-shadow-sm flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/50">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-3xl text-foreground">
                      {item.metric}
                    </p>
                    <Icon className="h-4 w-4 shrink-0 text-accent-2" />
                  </div>
                  <p className="section-label mt-1.5 text-[10px] text-accent uppercase">
                    {item.caption}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
