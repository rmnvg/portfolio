"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { useLenis } from "@/lib/lenis-context";
import {
  buildIndex,
  highlightTokens,
  search,
  SUGGESTED_QUERIES,
} from "@/lib/retrieval";

export default function ResumeSearch() {
  const index = useMemo(() => buildIndex(), []);
  const [query, setQuery] = useState("");
  const lenis = useLenis();

  const result = useMemo(() => {
    if (query.trim().length < 2) return null;
    return search(index, query, 3);
  }, [index, query]);

  const jumpTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="ask" className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <SectionHeading
          index="06"
          label="Interrogate"
          title="Ask this résumé anything"
        />

        <Reveal delay={0.05}>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
            Rather than describe how I build retrieval systems, here is one.
            Every passage of my experience is indexed and scored with BM25 and
            domain-aware query expansion — running entirely in your browser,
            no server, no API key. Ask it something.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="offset-shadow overflow-hidden rounded-lg border border-border bg-surface">
            {/* console chrome */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="section-label text-[10px] text-muted uppercase">
                retrieval console
              </span>
              <span className="section-label text-[10px] text-muted">
                {index.docs.length} passages indexed
              </span>
            </div>

            {/* prompt */}
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
              <span className="font-mono text-sm text-accent">▸</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="does he know vector databases?"
                aria-label="Search this résumé"
                className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted/60 sm:text-base"
              />
              {query.length === 0 && (
                <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted/50" />
              )}
            </div>

            {/* suggestions */}
            {!result && (
              <div className="flex flex-wrap gap-2 border-t border-border px-4 py-4 sm:px-6">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-3.5 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent sm:min-h-0 sm:py-1.5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* results */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={query}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-border"
                >
                  {/* telemetry */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border bg-surface-2/50 px-4 py-2.5 sm:px-6">
                    <span className="section-label text-[10px] text-accent-2">
                      {result.hits.length} retrieved
                    </span>
                    <span className="section-label text-[10px] text-muted">
                      {result.elapsedMs.toFixed(2)} ms
                    </span>
                    <span className="section-label text-[10px] text-muted">
                      bm25 · k1=1.5 · b=0.75
                    </span>
                    {result.expansions.length > 0 && (
                      <span className="section-label text-[10px] text-muted">
                        expanded:{" "}
                        {result.expansions
                          .map(
                            (e) =>
                              `${e.term} → ${e.expanded.slice(0, 3).join(" · ")}`,
                          )
                          .join("  |  ")}
                      </span>
                    )}
                  </div>

                  {result.hits.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted sm:px-6">
                      No passage scored above zero. Try asking about RAG,
                      vector search, AWS, or production impact.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {result.hits.map((hit, i) => (
                        <div key={hit.passage.id} className="px-4 py-5 sm:px-6">
                          <div className="mb-2.5 flex items-center gap-3">
                            <span className="section-label text-[10px] text-accent">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="section-label text-[10px] text-muted uppercase">
                              {hit.passage.section}
                            </span>
                            <div className="ml-auto flex items-center gap-2">
                              <div className="h-1 w-16 overflow-hidden rounded-full bg-surface-2">
                                <div
                                  className="h-full bg-gradient-to-r from-accent to-accent-2"
                                  style={{
                                    width: `${Math.round(hit.normalized * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="section-label text-[10px] text-muted">
                                {hit.score.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm leading-relaxed text-foreground/85">
                            {highlightTokens(hit.snippet, hit.matchedStems).map(
                              (chunk, j) =>
                                chunk.hit ? (
                                  <mark
                                    key={j}
                                    className="bg-accent/20 text-foreground"
                                  >
                                    {chunk.text}
                                  </mark>
                                ) : (
                                  <span key={j}>{chunk.text}</span>
                                ),
                            )}
                          </p>

                          <button
                            onClick={() => jumpTo(hit.passage.anchor)}
                            className="mt-2 inline-flex min-h-11 items-center gap-1.5 py-2 text-xs text-muted transition-colors hover:text-accent sm:mt-3 sm:min-h-0 sm:py-0"
                          >
                            jump to source
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
