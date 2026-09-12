import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[130px]" />

      <div className="relative max-w-lg text-center">
        <p className="section-label text-[11px] text-accent uppercase">
          404 — no passage retrieved
        </p>
        <h1 className="font-display mt-5 text-5xl leading-[1.02] text-foreground sm:text-6xl">
          This page scored{" "}
          <em className="text-accent not-italic">zero.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-muted">
          Nothing in the index matches that URL. The rest of the corpus is
          still there.
        </p>

        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the beginning
        </Link>
      </div>
    </main>
  );
}
