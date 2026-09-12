export const personal = {
  name: "Ramanjot Singh",
  role: "Software Engineer · Gen AI",
  location: "Delhi, India",
  email: "ramanjotsingh247@gmail.com",
  phone: "+91 9811223306",
  github: "https://github.com/rmnvg",
  linkedin: "https://www.linkedin.com/in/ramanjot-singh-5b574422b/",
  resumeUrl: "/Ramanjotsingh_resume.pdf",
  tagline:
    "I build production-grade AI pipelines — RAG systems, semantic search, and LLM-powered workflows that process millions of documents a year.",
  summary:
    "Software Engineer with hands-on experience building Gen AI systems for insurance and financial workflows. I care about turning research-grade ML ideas into reliable, auditable, high-throughput production pipelines — from document classification to retrieval-augmented generation.",
  badge: "Ex-Zinnia · Building Gen AI systems",
};

export const stats = [
  { label: "Documents processed / year", value: "2.5M+" },
  { label: "Straight-through processing", value: "85–90%" },
  { label: "DSA problems solved", value: "700+" },
  { label: "LinkedIn views", value: "2M+" },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  stack: string[];
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Zinnia",
    role: "Software Engineer — Gen AI (Full-Time, prev. Intern)",
    period: "Jan 2025 — Jul 2026",
    stack: [
      "Python",
      "FastAPI",
      "Django",
      "Celery",
      "Qdrant",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "AWS Lambda",
      "AWS S3",
      "OpenAI",
      "Power BI",
    ],
    points: [
      "Architected a multi-tier document classification pipeline (barcode → OCR → semantic search → LLM fallback) processing ~8K–10K documents/day (~2.5M/year) for insurance and financial workflows.",
      "Achieved 85–90% straight-through processing (STP), significantly reducing manual review effort and operational costs.",
      "Built Power BI dashboards on pipeline logs (PostgreSQL/MongoDB) to track STP rate, throughput, fallback/error trends, and per-stage latency for real-time ops visibility.",
      "Built semantic classification using text embeddings + Qdrant vector search as an intelligent fallback, with LLM-based validation layers, confidence thresholds, and critic-model checks for safe, auditable outputs.",
      "Designed an event-driven, serverless architecture on AWS Lambda with fault-tolerant, timeout-aware, multiprocessed execution for high-throughput document workflows.",
      "Engineered a production-grade RAG pipeline (OpenAI embeddings + Qdrant) for Q&A over large-scale insurance document corpora, plus LLM-powered multi-document comparison for cross-policy analysis.",
      "Built scalable PDF ingestion pipelines with Django, FastAPI, Celery, PostgreSQL, MongoDB, Redis, and AWS S3 — chunking, embedding, and retrieval optimized for low-latency, high-precision use.",
    ],
  },
];

export type Project = {
  name: string;
  description: string;
  points: string[];
  stack: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    name: "HireFlow AI",
    description:
      "An AI-assisted recruiting workflow that turns a job description into structured requirements, surfaces recruiter-approved contacts, and runs consented AI screening calls.",
    points: [
      "Built as a production-oriented monorepo with independently deployable Next.js and FastAPI containers, shipped as multi-stage images to Amazon ECR and ECS.",
      "Extracts structured requirements — skills, seniority, location, experience, search keywords — from raw job descriptions, every field recruiter-editable before use.",
      "Integrated Apollo contact search with per-job deduplication and Hunar voice agents for screening calls, persisting jobs, candidates, calls, and webhook events in Supabase PostgreSQL.",
      "Processes signed, idempotent webhooks for call outcomes — status, summaries, duration, recordings — surfaced live in the recruiter dashboard.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Docker",
      "AWS ECS",
    ],
    link: "https://github.com/rmnvg/HireFlow-AI",
  },
  {
    name: "Census Insight Agent",
    description:
      "A citation-grounded LangGraph agent over 341 pages of Census reports, built for reliable, verifiable multi-state comparisons.",
    points: [
      "Combined Vertex AI dense embeddings, BM25 retrieval, and Qdrant reciprocal-rank fusion with per-entity evidence reservation.",
      "Designed an end-to-end provenance chain: PDF checksum → page-bounded chunks → verified claims → citations.",
      "Added one-shot citation repair, structural refusals, and an isolated, network-disabled Python executor for generating validated charts and tables.",
    ],
    stack: ["Python", "FastAPI", "LangGraph", "Vertex AI", "Qdrant", "Docker"],
    link: "https://github.com/rmnvg/census-insight-agent",
  },
  {
    name: "Hybrid Deep-Learning Stock Forecasting",
    description:
      "An advanced stock price prediction system fusing sequence models, gradient boosting, and anomaly detection over a decade of market data.",
    points: [
      "Integrated LSTM, XGBoost, and anomaly detection (Isolation Forest, Autoencoder) over 10+ years of market, fundamental, and macroeconomic data.",
      "Implemented an Attention-based LSTM, cutting RMSE by up to 67.6% (Tesla), 44.9% (Amazon), and 60.6% (Nvidia).",
      "Achieved R² scores up to 0.99 (Apple) and 0.97 (Google, Tesla, Nvidia) — a 7% improvement in R² overall.",
    ],
    stack: ["Python", "TensorFlow", "Keras", "XGBoost", "scikit-learn"],
    link: "https://github.com/rmnvg/stockprice_prediction",
  },
];

export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "AI / ML",
    items: [
      "LLMs",
      "RAG",
      "Prompt Engineering",
      "Embeddings",
      "Vector Search",
      "Semantic Classification",
      "OCR",
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: ["FastAPI", "Django", "LangChain", "LangGraph", "Celery", "React"],
  },
  {
    category: "Databases & Search",
    items: ["PostgreSQL", "MongoDB", "Redis", "Qdrant"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS Lambda", "AWS S3", "AWS EC2", "Docker"],
  },
  {
    category: "Data & Visualization",
    items: ["Power BI", "SQL", "Data Modeling"],
  },
  {
    category: "Languages & Fundamentals",
    items: ["Python", "C++", "DBMS", "OS", "OOP", "System Design"],
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  detail: string;
};

export const education: EducationItem[] = [
  {
    school: "Netaji Subhas University of Technology, Delhi",
    degree: "B.Tech in Computer Science & Engineering",
    period: "Dec 2021 — May 2025",
    detail: "8.35 / 10 CGPA",
  },
  {
    school: "Sant Gyaneshwar Model School, Delhi",
    degree: "Higher Secondary Education",
    period: "Jul 2018 — Mar 2020",
    detail: "Class 12th — 91.4% · Class 10th — 94.6%",
  },
];

export type Achievement = {
  /** Headline figure, pulled out so the section scans as numbers, not prose. */
  metric: string;
  caption: string;
  text: string;
  kind: "code" | "exam" | "leadership" | "teaching" | "writing";
  featured?: boolean;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    metric: "2M+",
    caption: "LinkedIn views",
    text: "Consistently publish on LinkedIn about Gen AI systems, retrieval and production ML — 2M+ views and 17K+ followers.",
    kind: "writing",
    featured: true,
    link: "https://www.linkedin.com/in/ramanjot-singh-5b574422b/",
  },
  {
    metric: "700+",
    caption: "DSA problems solved",
    text: "Mastered 700+ DSA questions across LeetCode and GeeksforGeeks.",
    kind: "code",
  },
  {
    metric: "AIR 4766",
    caption: "JEE Mains",
    text: "Achieved AIR 4766 in JEE Mains, surpassing over 1 million students.",
    kind: "exam",
  },
  {
    metric: "AIR 6212",
    caption: "JEE Advanced",
    text: "Attained AIR 6212 in JEE Advanced, among 200K qualifiers from 1 million candidates.",
    kind: "exam",
  },
  {
    metric: "200+",
    caption: "Students placed",
    text: "Served as Placement Coordinator — managed placements for 200+ students and coordinated with 10+ companies.",
    kind: "leadership",
  },
  {
    metric: "50+",
    caption: "Juniors mentored",
    text: "Mentored 50+ juniors in DSA through dedicated teaching sessions.",
    kind: "teaching",
  },
];

// Order mirrors the page so the scroll-spy indicator tracks it.
export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#ask", label: "Ask" },
  { href: "#contact", label: "Contact" },
];
