"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

export default function ParticleAvatar({
  src,
  size = 280,
  gap = 3.4,
  brightnessCutoff = 232,
}: {
  src: string;
  size?: number;
  gap?: number;
  brightnessCutoff?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let particles: Particle[] = [];
    let animationId = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const sample = document.createElement("canvas");
      sample.width = size;
      sample.height = size;
      const sctx = sample.getContext("2d");
      if (!sctx) return;

      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      sctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

      const { data } = sctx.getImageData(0, 0, size, size);
      const radius = size / 2;
      const built: Particle[] = [];

      for (let y = 0; y < size; y += gap) {
        for (let x = 0; x < size; x += gap) {
          const dx = x - radius;
          const dy = y - radius;
          if (dx * dx + dy * dy > radius * radius) continue;

          const i = (Math.round(y) * size + Math.round(x)) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          // Drop near-white background pixels so the silhouette reads clearly.
          if (brightness > brightnessCutoff) continue;

          built.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: 0.9 + (1 - brightness / 255) * 1.6,
            color: `rgb(${r},${g},${b})`,
          });
        }
      }
      particles = built;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const repelRadius = size * 0.16;
    const ease = 0.08;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      for (const p of particles) {
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 2.4;
            p.vy += Math.sin(angle) * force * 2.4;
          }
        }

        p.vx += (p.originX - p.x) * ease * 0.18;
        p.vy += (p.originY - p.y) * ease * 0.18;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [src, size, gap, brightnessCutoff]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive particle portrait"
      role="img"
    />
  );
}
