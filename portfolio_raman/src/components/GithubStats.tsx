"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TiltCard from "@/components/TiltCard";
import Counter from "@/components/Counter";
import { personal, projects } from "@/lib/data";

type Repo = {
  id: number;
  name: string;
  html_url: string;
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

const PINNED_REPOS = ["census-insight-agent", "stockprice_prediction"];
const USERNAME = "rmnvg";

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)} yr ago`;
}

export default function GithubStats() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [profileRes, ...repoResults] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          ...PINNED_REPOS.map((name) =>
            fetch(`https://api.github.com/repos/${USERNAME}/${name}`),
          ),
        ]);
        if (!profileRes.ok || repoResults.some((r) => !r.ok)) {
          throw new Error("request failed");
        }

        const profileData = (await profileRes.json()) as Profile;
        const repoData = (await Promise.all(
          repoResults.map((r) => r.json()),
        )) as Repo[];

        if (!cancelled) {
          setProfile(profileData);
          setRepos(repoData);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return null;

  const loading = !profile || !repos;

  return (
    <section id="github" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          index="04"
          label="Open Source"
          title="Live from GitHub"
        />

        <Reveal delay={0.02} className="mb-10 flex flex-wrap gap-8">
          <div>
            <p className="text-2xl font-semibold text-gradient sm:text-3xl">
              {profile ? <Counter value={`${profile.public_repos}+`} /> : "—"}
            </p>
            <p className="mt-1 text-xs text-muted">Public repositories</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gradient sm:text-3xl">
              {profile ? <Counter value={`${profile.followers}+`} /> : "—"}
            </p>
            <p className="mt-1 text-xs text-muted">Followers</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-border bg-surface"
                />
              ))
            : repos!.map((repo, i) => {
                const project = projects.find((p) => p.link?.includes(repo.name));
                return (
                  <Reveal key={repo.id} delay={i * 0.06} className="h-full">
                    <TiltCard className="h-full">
                      <motion.a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <h3 className="font-medium text-foreground">
                            {project?.name ?? repo.name}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" />
                        </div>
                        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                          {project?.description ?? "Open source project."}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  background:
                                    LANGUAGE_COLORS[repo.language] ?? "#8b7bff",
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3.5 w-3.5" />
                            {repo.forks_count}
                          </span>
                          <span className="ml-auto">
                            {timeAgo(repo.updated_at)}
                          </span>
                        </div>
                      </motion.a>
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
