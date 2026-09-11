const ITEMS = [
  "RAG Pipelines",
  "Vector Search",
  "LLM Systems",
  "Semantic Classification",
  "AWS Lambda",
  "LangGraph",
  "Qdrant",
  "FastAPI",
  "Production ML",
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface py-4">
      <div className="animate-marquee flex w-max items-center gap-10">
        {loop.map((item, i) => (
          <span
            key={i}
            className="section-label flex items-center gap-10 text-sm text-muted"
          >
            {item}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
