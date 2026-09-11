import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <Reveal className="mb-12 flex items-baseline gap-4">
      <span className="section-label text-sm text-accent">{index}</span>
      <div>
        <p className="section-label mb-2 text-xs text-muted uppercase">
          {label}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
