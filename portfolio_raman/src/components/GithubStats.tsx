"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import { personal, projects } from "@/lib/data";

type RepoStats = {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
};

type Profile = {
  public_repos: number;
  followers: number;
};

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

const USERNAME = "rmnvg";

function repoNameFromUrl(url: string) {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return "updated today";
  if (days === 1) return "updated 1 day ago";
  if (days < 30) return `updated ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `updated ${months} mo ago`;
  return `updated ${Math.floor(months / 12)} yr ago`;
}

const REPO_PROJECTS = projects.filter((p) => p.link?.includes("github.com"));

export default function GithubStats() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Record<string, RepoStats>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${USERNAME}`);
        if (res.ok && !cancelled) {
          setProfile((await res.json()) as Profile);
        }
      } catch {
        // live enrichment is optional — the section stands without it
      }

      for (const project of REPO_PROJECTS) {
        if (cancelled) return;
        const name = repoNameFromUrl(project.link!);
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USERNAME}/${name}`,
          );
          if (!res.ok) continue;
          const data = (await res.json()) as RepoStats;
          if (!cancelled) {
            setStats((prev) => ({ ...prev, [name]: data }));
          }
        } catch {
          // skip this repo's live stats
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="github" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="05"
          label="Open Source"
          title="Live from GitHub"
        />

        {profile && (
          <Reveal delay={0.02} className="mb-10 flex flex-wrap gap-8">
            <div>
              <p className="text-2xl font-semibold text-gradient sm:text-3xl">
                <Counter value={`${profile.public_repos}+`} />
              </p>
              <p className="mt-1 text-xs text-muted">Public repositories</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gradient sm:text-3xl">
                <Counter value={`${profile.followers}+`} />
              </p>
              <p className="mt-1 text-xs text-muted">Followers</p>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {REPO_PROJECTS.map((project, i) => {
            const name = repoNameFromUrl(project.link!);
            const live = stats[name];
            return (
              <Reveal key={project.name} delay={i * 0.06} className="h-full">
                <TiltCard className="group h-full">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col offset-shadow-sm rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/50"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {project.name}
                        </h3>
                        <p className="section-label mt-1 text-[10px] text-muted">
                          {USERNAME}/{name}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
                    </div>

                    <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                      {live ? (
                        <>
                          {live.language && (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  background:
                                    LANGUAGE_COLORS[live.language] ?? "#8b7bff",
                                }}
                              />
                              {live.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" />
                            {live.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3.5 w-3.5" />
                            {live.forks_count}
                          </span>
                          <span className="ml-auto">
                            {timeAgo(live.updated_at)}
                          </span>
                        </>
                      ) : (
                        project.stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="section-label text-[10px] text-muted"
                          >
                            {tech}
                          </span>
                        ))
                      )}
                    </div>
                  </a>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-8">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            View all repositories on GitHub{" "}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
