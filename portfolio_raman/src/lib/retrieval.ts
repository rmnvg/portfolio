import {
  achievements,
  education,
  experience,
  personal,
  projects,
  skills,
} from "./data";

export type Passage = {
  id: string;
  section: string;
  anchor: string;
  text: string;
};

export type SearchHit = {
  passage: Passage;
  score: number;
  normalized: number;
  snippet: string;
  matchedStems: string[];
};

export type SearchResult = {
  hits: SearchHit[];
  expansions: { term: string; expanded: string[] }[];
  elapsedMs: number;
  totalPassages: number;
};

const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","been","being","but","by","can","did","do",
  "does","for","from","had","has","have","he","her","him","his","how","i","in","is",
  "it","its","me","my","of","on","or","our","she","that","the","their","them","then",
  "there","these","they","this","to","was","were","what","when","where","which","who",
  "whom","why","will","with","you","your","about","into","over","under","also","any",
  "all","more","most","much","many","some","such","than","too","very","just","get",
  "got","would","could","should","may","might","must","am","if","no","not","only",
  "own","same","so","up","out","off","down","again","here","both","each","few","other",
  "because","while","during","before","after","above","below","between","through",
  "against","tell","show","know","knows","work","works","worked","use","uses","used",
]);

// Domain-aware query expansion — mirrors the sparse side of a hybrid retriever.
const EXPANSIONS: Record<string, string[]> = {
  rag: ["retrieval", "augmented", "generation", "embedding", "qdrant", "corpora"],
  retrieval: ["rag", "qdrant", "embedding", "bm25", "search"],
  vector: ["qdrant", "embedding", "semantic", "search"],
  embedding: ["qdrant", "vector", "openai", "vertex", "semantic"],
  llm: ["openai", "gpt", "language", "model", "prompt", "critic"],
  ai: ["llm", "gen", "model", "ml", "learning"],
  ml: ["learning", "lstm", "xgboost", "tensorflow", "model", "anomaly"],
  agent: ["langgraph", "langchain", "citation", "provenance", "tool"],
  aws: ["lambda", "s3", "ec2", "serverless", "cloud"],
  cloud: ["aws", "lambda", "s3", "ec2", "docker"],
  database: ["postgresql", "mongodb", "redis", "qdrant", "sql"],
  backend: ["fastapi", "django", "celery", "api", "pipeline"],
  frontend: ["react", "typescript"],
  devops: ["docker", "aws", "serverless", "lambda"],
  impact: ["stp", "throughput", "reduced", "improved", "cost", "rmse"],
  scale: ["throughput", "documents", "day", "million", "latency"],
  performance: ["latency", "throughput", "rmse", "optimized", "precision"],
  education: ["nsut", "netaji", "btech", "cgpa", "university"],
  college: ["nsut", "netaji", "btech", "university", "cgpa"],
  experience: ["zinnia", "engineer", "architected", "built"],
  job: ["zinnia", "engineer", "experience"],
  project: ["census", "stock", "forecasting", "agent"],
  python: ["fastapi", "django", "tensorflow", "celery"],
  data: ["power", "bi", "sql", "modeling", "postgresql"],
  dsa: ["leetcode", "gfg", "algorithms", "questions"],
  leadership: ["mentored", "coordinator", "placement", "juniors"],
  ocr: ["barcode", "document", "classification", "extraction"],
  document: ["ocr", "pdf", "classification", "ingestion", "chunking"],
};

function normalizeToken(token: string): string {
  if (token.length <= 3) return token;
  return token
    .replace(/ies$/, "y")
    .replace(/sses$/, "ss")
    .replace(/([^s])s$/, "$1")
    .replace(/(ing|ed)$/, "");
}

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(normalizeToken)
    .filter(Boolean);
}

function buildCorpus(): Passage[] {
  const passages: Passage[] = [];

  passages.push({
    id: "profile-0",
    section: "Profile",
    anchor: "about",
    text: `${personal.name} is a ${personal.role} based in ${personal.location}. ${personal.summary} ${personal.tagline}`,
  });

  experience.forEach((role, roleIndex) => {
    role.points.forEach((point, i) => {
      passages.push({
        id: `exp-${roleIndex}-${i}`,
        section: `${role.company} · ${role.period}`,
        anchor: "experience",
        text: point,
      });
    });
  });

  projects.forEach((project, projectIndex) => {
    passages.push({
      id: `proj-${projectIndex}-desc`,
      section: project.name,
      anchor: "projects",
      text: `${project.description} Built with ${project.stack.join(", ")}.`,
    });
    project.points.forEach((point, i) => {
      passages.push({
        id: `proj-${projectIndex}-${i}`,
        section: project.name,
        anchor: "projects",
        text: point,
      });
    });
  });

  skills.forEach((group, i) => {
    passages.push({
      id: `skill-${i}`,
      section: `Skills · ${group.category}`,
      anchor: "skills",
      text: `${group.category}: ${group.items.join(", ")}.`,
    });
  });

  education.forEach((item, i) => {
    passages.push({
      id: `edu-${i}`,
      section: "Education",
      anchor: "about",
      text: `${item.degree} at ${item.school}, ${item.period}. ${item.detail}.`,
    });
  });

  achievements.forEach((item, i) => {
    passages.push({
      id: `ach-${i}`,
      section: "Achievements",
      anchor: "achievements",
      text: item.text,
    });
  });

  return passages;
}

type IndexedDoc = {
  passage: Passage;
  stems: string[];
  counts: Map<string, number>;
  length: number;
};

export type SearchIndex = {
  docs: IndexedDoc[];
  avgLength: number;
};

export function buildIndex(): SearchIndex {
  const docs = buildCorpus().map((passage) => {
    const stems = tokenize(passage.text);
    const counts = new Map<string, number>();
    for (const stem of stems) {
      counts.set(stem, (counts.get(stem) ?? 0) + 1);
    }
    return { passage, stems, counts, length: stems.length };
  });

  const avgLength =
    docs.reduce((sum, d) => sum + d.length, 0) / Math.max(docs.length, 1);

  return { docs, avgLength };
}

// Generalized term match: exact stem, or prefix overlap (wildcard-style expansion).
function termAffinity(queryStem: string, docStem: string): number {
  if (queryStem === docStem) return 1;
  if (queryStem.length >= 4 && docStem.startsWith(queryStem)) return 0.6;
  if (docStem.length >= 4 && queryStem.startsWith(docStem)) return 0.5;
  return 0;
}

const K1 = 1.5;
const B = 0.75;
const EXPANSION_WEIGHT = 0.45;

function bestSentence(text: string, matched: Set<string>): string {
  const sentences = text
    .split(/(?<=[.!?;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return text;

  let best = sentences[0];
  let bestScore = -1;
  for (const sentence of sentences) {
    const stems = tokenize(sentence);
    let score = 0;
    for (const stem of stems) {
      for (const m of matched) {
        score += termAffinity(m, stem);
      }
    }
    const normalized = score / Math.sqrt(Math.max(stems.length, 1));
    if (normalized > bestScore) {
      bestScore = normalized;
      best = sentence;
    }
  }
  return best;
}

export function search(
  index: SearchIndex,
  query: string,
  limit = 3,
): SearchResult {
  const start = performance.now();
  const baseStems = Array.from(new Set(tokenize(query)));

  const expansions: { term: string; expanded: string[] }[] = [];
  const weightedTerms = new Map<string, number>();

  for (const stem of baseStems) {
    weightedTerms.set(stem, 1);
  }

  for (const stem of baseStems) {
    const extra = EXPANSIONS[stem];
    if (!extra) continue;
    // Score on stems, but surface the human-readable words in the UI.
    const addedWords: string[] = [];
    for (const word of extra) {
      const t = normalizeToken(word);
      if (weightedTerms.has(t)) continue;
      weightedTerms.set(t, EXPANSION_WEIGHT);
      addedWords.push(word);
    }
    if (addedWords.length > 0) {
      expansions.push({ term: stem, expanded: addedWords });
    }
  }

  const N = index.docs.length;
  const scored: SearchHit[] = [];

  // Document frequency per query term, using the same generalized matcher.
  const docFrequency = new Map<string, number>();
  for (const [term] of weightedTerms) {
    let df = 0;
    for (const doc of index.docs) {
      let present = false;
      for (const stem of doc.counts.keys()) {
        if (termAffinity(term, stem) > 0) {
          present = true;
          break;
        }
      }
      if (present) df += 1;
    }
    docFrequency.set(term, df);
  }

  for (const doc of index.docs) {
    let score = 0;
    const matchedStems = new Set<string>();

    for (const [term, weight] of weightedTerms) {
      let tf = 0;
      for (const [stem, count] of doc.counts) {
        const affinity = termAffinity(term, stem);
        if (affinity > 0) {
          tf += affinity * count;
          matchedStems.add(stem);
        }
      }
      if (tf === 0) continue;

      const df = docFrequency.get(term) ?? 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
      const denominator =
        tf + K1 * (1 - B + (B * doc.length) / Math.max(index.avgLength, 1));
      score += weight * idf * ((tf * (K1 + 1)) / denominator);
    }

    if (score > 0) {
      scored.push({
        passage: doc.passage,
        score,
        normalized: 0,
        snippet: bestSentence(doc.passage.text, matchedStems),
        matchedStems: Array.from(matchedStems),
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const hits = scored.slice(0, limit);
  const max = hits[0]?.score ?? 1;
  for (const hit of hits) {
    hit.normalized = max > 0 ? hit.score / max : 0;
  }

  return {
    hits,
    expansions,
    elapsedMs: performance.now() - start,
    totalPassages: N,
  };
}

export function highlightTokens(text: string, matchedStems: string[]) {
  const matched = new Set(matchedStems);
  return text.split(/(\s+)/).map((chunk) => {
    if (!chunk.trim()) return { text: chunk, hit: false };
    const clean = chunk.toLowerCase().replace(/[^a-z0-9.+#-]/g, "");
    if (!clean) return { text: chunk, hit: false };
    const stem = normalizeToken(clean);
    let hit = false;
    for (const m of matched) {
      if (termAffinity(m, stem) >= 0.5) {
        hit = true;
        break;
      }
    }
    return { text: chunk, hit };
  });
}

export const SUGGESTED_QUERIES = [
  "What has he built with RAG?",
  "Does he know vector databases?",
  "What was his biggest production impact?",
  "Experience with AWS and serverless?",
  "Show me his machine learning work",
];
