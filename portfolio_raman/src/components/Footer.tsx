import { personal } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted sm:flex-row sm:px-10">
        <p>
          © {new Date().getFullYear()} {personal.name}. All rights reserved.
        </p>
        <p className="section-label">Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
