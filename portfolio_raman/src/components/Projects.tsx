import { ArrowUpRight, FolderGit2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/TiltCard";
import RepoMeta from "@/components/RepoMeta";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="03"
          label="Projects"
          title="Things I've built"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.1} className="h-full">
              <TiltCard className="group h-full">
                <div className="flex h-full flex-col offset-shadow-sm rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/50 sm:p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-accent">
                      <FolderGit2 className="h-5 w-5" />
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} source code`}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-accent group-hover:text-accent sm:h-9 sm:w-9"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  <ul className="mt-4 space-y-2.5">
                    {project.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2 pt-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="section-label rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* mt-auto pins the repo line to the card floor so it lines
                      up across cards of differing height. */}
                  {project.link?.includes("github.com") && (
                    <div className="mt-auto border-t border-border pt-4">
                      <RepoMeta url={project.link} />
                    </div>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
