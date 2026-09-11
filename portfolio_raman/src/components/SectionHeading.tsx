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
    <Reveal className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="section-label text-[11px] text-accent">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span className="section-label text-[11px] text-muted uppercase">
          {label}
        </span>
      </div>
      <h2 className="font-display text-4xl leading-[1.02] text-foreground sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
