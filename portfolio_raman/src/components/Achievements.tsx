import { Trophy } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { achievements } from "@/lib/data";

export default function Achievements() {
  return (
    <section id="achievements" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="07"
          label="Achievements"
          title="Highlights along the way"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {achievements.map((item, i) => (
            <Reveal key={item} delay={i * 0.05}>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5">
                <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                <p className="text-sm leading-relaxed text-muted">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
