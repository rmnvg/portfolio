"use client";

import { useEffect, useMemo, useState } from "react";
import { GitFork, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons";

type RepoStats = {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
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

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return "updated today";
  if (days === 1) return "updated 1 day ago";
  if (days < 30) return `updated ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `updated ${months} mo ago`;
  return `updated ${Math.floor(months / 12)} yr ago`;
}

/** Parses "https://github.com/owner/repo" into its slug. */
function parseSlug(url: string) {
  const parts = url.replace(/\/+$/, "").split("/");
  const repo = parts.pop();
  const owner = parts.pop();
  return owner && repo ? { owner, repo } : null;
}

/**
 * Repo identity for a project card. The slug renders immediately from the
 * link itself; stars/forks/language are enriched from the GitHub API when it
 * is reachable, and simply stay absent when it is not.
 */
export default function RepoMeta({ url }: { url: string }) {
  // Memoised so the object identity is stable across renders and the effect
  // below can depend on it without re-firing.
  const slug = useMemo(() => parseSlug(url), [url]);
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetch(`https://api.github.com/repos/${slug.owner}/${slug.repo}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RepoStats | null) => {
        if (data && !cancelled) setStats(data);
      })
      .catch(() => {
        // Live enrichment is optional — the slug stands on its own.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="section-label inline-flex min-h-11 items-center gap-1.5 py-2 text-[11px] transition-colors hover:text-accent sm:min-h-0 sm:py-0"
      >
        <GithubIcon className="h-3.5 w-3.5 shrink-0" />
        {slug.owner}/{slug.repo}
      </a>

      {stats && (
        <>
          {stats.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: LANGUAGE_COLORS[stats.language] ?? "#8b7bff",
                }}
              />
              {stats.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {stats.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {stats.forks_count}
          </span>
          <span className="text-muted/70">{timeAgo(stats.updated_at)}</span>
        </>
      )}
    </div>
  );
}
