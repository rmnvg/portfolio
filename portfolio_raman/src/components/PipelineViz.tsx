"use client";

import { useEffect, useRef, useState } from "react";

type Stage = {
  id: string;
  label: string;
  detail: string;
  share: number;
};

const STAGES: Stage[] = [
  {
    id: "barcode",
    label: "Barcode",
    detail: "Deterministic match on cover-sheet barcodes. Cheapest path, taken first.",
    share: 0.46,
  },
  {
    id: "ocr",
    label: "OCR",
    detail: "Text extraction plus rules for documents without a usable barcode.",
    share: 0.25,
  },
  {
    id: "semantic",
    label: "Semantic search",
    detail: "Text embeddings over Qdrant vector search when the layout is unseen.",
    share: 0.12,
  },
  {
    id: "llm",
    label: "LLM fallback",
    detail: "Confidence thresholds and a critic model for the ambiguous remainder.",
    share: 0.04,
  },
];

type Particle = {
  x: number;
  y: number;
  speed: number;
  stageIndex: number;
  state: "travelling" | "falling" | "exiting";
  resolvedAt: number;
};

export default function PipelineViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [processed, setProcessed] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let inflight = "#e4703a";
    let resolved = "#5fb49c";
    let hairline = "rgba(255,255,255,0.12)";
    const readPalette = () => {
      const styles = getComputedStyle(document.documentElement);
      inflight = styles.getPropertyValue("--accent").trim() || inflight;
      resolved = styles.getPropertyValue("--accent-2").trim() || resolved;
      hairline = styles.getPropertyValue("--border").trim() || hairline;
    };
    readPalette();

    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let railY = 0;
    let bottomY = 0;
    let columns: { centerX: number; top: number; bottom: number }[] = [];
    let active = false;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = stageRefs.current.filter(Boolean).map((el) => {
        const r = el!.getBoundingClientRect();
        return {
          centerX: r.left - rect.left + r.width / 2,
          top: r.top - rect.top,
          bottom: r.bottom - rect.top,
        };
      });

      // Only animate the rail diagram when stages sit side by side.
      active =
        columns.length === STAGES.length &&
        columns[columns.length - 1].centerX > columns[0].centerX + 40 &&
        Math.abs(columns[0].top - columns[columns.length - 1].top) < 8;

      if (active) {
        railY = Math.max(columns[0].top - 26, 10);
        bottomY = columns[0].bottom + 30;
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const particles: Particle[] = [];
    let completed = 0;
    let lastSync = 0;
    let spawnAccumulator = 0;
    let raf = 0;
    let last = performance.now();

    const spawn = () => {
      particles.push({
        x: -10,
        y: railY,
        speed: 165 + Math.random() * 85,
        stageIndex: 0,
        state: "travelling",
        resolvedAt: -1,
      });
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      if (!active) return;

      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = inflight;
      ctx.lineWidth = 1;

      // top rail
      ctx.beginPath();
      ctx.moveTo(0, railY);
      ctx.lineTo(width, railY);
      ctx.stroke();

      // bottom rail
      ctx.strokeStyle = resolved;
      ctx.beginPath();
      ctx.moveTo(columns[0].centerX, bottomY);
      ctx.lineTo(width, bottomY);
      ctx.stroke();

      // stubs into and out of each stage
      ctx.globalAlpha = 1;
      ctx.strokeStyle = hairline;
      for (const col of columns) {
        ctx.beginPath();
        ctx.moveTo(col.centerX, railY);
        ctx.lineTo(col.centerX, col.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(col.centerX, col.bottom);
        ctx.lineTo(col.centerX, bottomY);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      drawStatic();

      if (active) {
        spawnAccumulator += dt;
        if (spawnAccumulator > 0.14) {
          spawnAccumulator = 0;
          spawn();
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          if (p.state === "travelling") {
            p.x += p.speed * dt;
            const col = columns[p.stageIndex];
            if (col && p.x >= col.centerX) {
              if (Math.random() < STAGES[p.stageIndex].share) {
                p.state = "falling";
                p.x = col.centerX;
                p.resolvedAt = p.stageIndex;
              } else {
                p.stageIndex += 1;
              }
            }
            if (p.x > width + 20) {
              particles.splice(i, 1);
              continue;
            }
          } else if (p.state === "falling") {
            p.y += 420 * dt;
            if (p.y >= bottomY) {
              p.y = bottomY;
              p.state = "exiting";
            }
          } else {
            p.x += (p.speed + 120) * dt;
            if (p.x > width + 20) {
              particles.splice(i, 1);
              completed += 1;
              continue;
            }
          }

          const isResolved = p.resolvedAt >= 0;
          ctx.globalAlpha = isResolved ? 0.95 : 0.75;
          ctx.fillStyle = isResolved ? resolved : inflight;
          ctx.fillRect(p.x - 2, p.y - 2.5, 4, 5);
          ctx.globalAlpha = 1;
        }

        if (now - lastSync > 220) {
          lastSync = now;
          setProcessed(completed);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div className="offset-shadow rounded-lg border border-border bg-surface/70 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
        <span className="section-label text-[10px] text-muted uppercase">
          document classification pipeline · zinnia
        </span>
        <span className="section-label hidden text-[10px] text-muted md:inline">
          {processed.toLocaleString()} docs routed this session
        </span>
      </div>

      <div ref={containerRef} className="relative px-4 pt-9 pb-6 sm:px-5">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          {STAGES.map((stage, i) => (
            <div
              key={stage.id}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              onMouseEnter={() => setHovered(stage.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-md border bg-background px-3.5 py-3 transition-colors ${
                hovered === stage.id ? "border-accent" : "border-border"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="section-label text-[10px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="section-label text-[10px] text-accent-2">
                  {Math.round(stage.share * 100)}%
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {stage.label}
              </p>
              <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-accent-2/70"
                  style={{ width: `${stage.share * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* lane reserved for the straight-through output rail */}
        <div className="hidden h-14 md:block" />

        <p className="relative mt-4 min-h-[2rem] max-w-2xl text-xs leading-relaxed text-muted">
          {hovered
            ? STAGES.find((s) => s.id === hovered)?.detail
            : "Each tier resolves what it can and passes the rest down. 85–90% of documents clear without a human — the remainder routes to manual review."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border px-4 py-2.5 sm:px-5">
        <span className="section-label text-[10px] text-muted">
          ~8–10K docs/day
        </span>
        <span className="section-label text-[10px] text-muted">
          ~2.5M docs/year
        </span>
        <span className="section-label text-[10px] text-accent-2">
          85–90% straight-through
        </span>
        <span className="section-label ml-auto text-[10px] text-muted/60">
          architecture shipped · flow simulated
        </span>
      </div>
    </div>
  );
}
