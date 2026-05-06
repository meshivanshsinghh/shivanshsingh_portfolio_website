/**
 * Wipe & re-seed Sanity with the data from local static files.
 *
 * What it touches:
 *   project, experience, education, award
 *   (does NOT touch post / author / announcement)
 *
 * Prerequisites:
 *   Add to .env.local:
 *     NEXT_PUBLIC_SANITY_PROJECT_ID=...
 *     NEXT_PUBLIC_SANITY_DATASET=production
 *     SANITY_DETAIL=...      ← Editor or Admin role token
 *
 * Run:
 *   npx tsx scripts/seed-sanity.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-11-09",
  token: process.env.SANITY_DETAIL,
  useCdn: false,
});

// ─────────────────────────────────────────────────────────────────
// 1. Local data (mirrors what the website currently shows)
// ─────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    _id: "experience-fia",
    _type: "experience",
    company: "Feminine Intelligence Agency (FIA)",
    role: "Tech Lead",
    period: "Jan 2026 - Present",
    type: "Contract",
    location: "Boston, MA",
    description: [
      "Lead a 30-student research team evaluating whether LLMs can detect psychological manipulation using a 28-trait UNES clinical psychology framework.",
      "Built a Python evaluation pipeline processing 170 Reddit relationship scenarios through GPT-4o, Claude, and DeepSeek, computing inter-rater reliability via Cohen's kappa.",
      "Models detect early danger reliably with a 2.25 Cohen's d effect size but fail at fine-grained classification with 19% accuracy across 17 manipulator player types.",
    ],
    skills: ["Python", "GPT-4o", "Claude", "DeepSeek", "NLP", "Research"],
    order: 1,
  },
  {
    _id: "experience-travlog",
    _type: "experience",
    company: "Travlog",
    role: "Software Engineer",
    period: "Jul 2023 - Jan 2025",
    type: "Full-time",
    location: "Remote - India",
    description: [
      "Built a modular social-media application for a YC-tracked startup for people trip planning alongside an offline-first SQLite storage layer across 15 schema iterations, later deployed to AWS cloud architecture.",
      "Engineered a monolithic backend API service using Kotlin and Node.js managing 40+ REST endpoints and a Firebase Cloud Messaging notification pipeline processing 500 tokens within 256MB memory limits.",
    ],
    skills: ["Flutter", "Kotlin", "Node.js", "AWS", "Firebase", "SQLite"],
    order: 2,
  },
];

const EDUCATION = [
  {
    _id: "education-northeastern",
    _type: "education",
    school: "Northeastern University",
    degree: "Master's degree",
    field: "Analytics",
    period: "Apr 2025 - Dec 2026",
    location: "Boston, Massachusetts, United States",
    gpa: "3.96",
    order: 1,
  },
  {
    _id: "education-iiitb",
    _type: "education",
    school: "International Institute of Information Technology Bangalore",
    degree: "PG Diploma",
    field: "Data Science",
    period: "May 2024 - Jan 2025",
    location: "Bangalore, India",
    gpa: "3.7",
    order: 2,
  },
  {
    _id: "education-lucknow",
    _type: "education",
    school: "University of Lucknow",
    degree: "Bachelor of Business Administration",
    field: "International Business",
    period: "2020 - 2023",
    location: "Lucknow, India",
    order: 3,
  },
];

const AWARDS = [
  {
    _id: "award-codelinc10",
    _type: "award",
    title: "Technical Innovation Award",
    org: "CodeLinc10 - Lincoln Financial",
    sponsor: "Cognizant",
    date: "Oct 2025",
    note: "Solo entry, 40-hour hackathon, 800-mile bus ride from Boston to North Carolina",
    order: 1,
  },
  {
    _id: "award-fia-leadership",
    _type: "award",
    title: "Leadership & Influence Award",
    org: "Feminine Intelligence Agency (FIA)",
    date: "Dec 2025",
    order: 2,
  },
];

const PROJECTS = [
  {
    _id: "project-dermrx-agent",
    _type: "project",
    title: "DermRx Agent",
    slug: { _type: "slug", current: "dermrx_agent" },
    description:
      "Agentic clinical pipeline integrating MedSigLIP, MedGemma 4B, TxGemma 2B, and a 302K-interaction drug database - compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds.",
    headline:
      "Agentic clinical pipeline compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds",
    award: "MedGemma Impact Challenge 2026",
    date: "Feb 2026",
    featured: true,
    tags: ["Healthcare AI", "LLM", "RAG", "Multi-Model"],
    techStack: ["Python", "FastAPI", "Next.js 15", "PyTorch", "MedGemma 4B", "TxGemma 2B", "MedSigLIP"],
    link: "https://kaggle.com/competitions/med-gemma-impact-challenge/writeups/dermrx-agent",
    overview:
      "Agentic clinical pipeline integrating MedSigLIP, MedGemma 4B, TxGemma 2B, and a 302K-interaction drug database. Built for Google's MedGemma Impact Challenge 2026.",
    features: [
      "Three-tier clinical classification framework for 141 dermatological conditions into 22 actionable categories",
      "Evidence-based treatment formulary of 170 FDA-sourced drugs with cross-referenced drug interactions",
      "Parallel safety checking: DDInter pairwise screening + TxGemma molecular toxicity in under 60 seconds",
    ],
  },
  {
    _id: "project-ncaa",
    _type: "project",
    title: "NCAA March Madness Predictor",
    slug: { _type: "slug", current: "ncaa" },
    description:
      "End-to-end tournament prediction pipeline for Kaggle's March Machine Learning Mania 2026. 29-feature XGBoost model incorporating Elo ratings, GLM team quality estimates, and pace-adjusted box scores from 211,716 regular season games - finishing top 20% (rank 599) among 3,000+ competitors.",
    headline:
      "Top 20% finish (rank 599) among 3,000+ competitors with a 29-feature XGBoost model blended against bookmaker odds",
    award: "Kaggle March Machine Learning Mania 2026",
    date: "Mar 2026",
    featured: true,
    tags: ["Machine Learning", "Sports Analytics", "XGBoost"],
    techStack: ["Python", "XGBoost", "scikit-learn", "pandas", "NumPy", "Google Colab"],
    overview:
      "End-to-end tournament prediction pipeline for Kaggle's March Machine Learning Mania 2026 (3,000+ competitors, $10K first prize).",
    features: [
      "Engineered 29 features including Elo ratings, GLM team quality estimates, and pace-adjusted box scores from 211,716 games",
      "Identified and fixed target leakage in spline calibration, reducing artificially optimistic CV scores",
      "Blended ML model with bookmaker odds at 75/25 ratio, optimized via backtesting against 2024-2025 results",
    ],
  },
  {
    _id: "project-rag-qa",
    _type: "project",
    title: "RAG Q&A System",
    slug: { _type: "slug", current: "rag_qa_system" },
    description:
      "Production retrieval-augmented Q&A pipeline using LangChain LCEL, OpenAI embeddings, and Qdrant Cloud. Includes automated RAGAS evaluation, LangSmith full-chain observability, and CI/CD to AWS App Runner via GitHub Actions.",
    headline:
      "Production RAG pipeline with automated evaluation, full-chain observability, and CI/CD to AWS",
    date: "Apr 2026",
    featured: true,
    tags: ["AI Systems", "Production ML", "RAG"],
    techStack: ["Python", "FastAPI", "LangChain", "OpenAI", "Qdrant", "Docker", "AWS"],
    overview:
      "Production-grade RAG Q&A system with real evaluation (RAGAS faithfulness/relevancy on every query), LangSmith observability, and a CD pipeline to AWS App Runner.",
    features: [
      "LangChain LCEL pipeline with OpenAI text-embedding-3-small and Qdrant Cloud vector store",
      "0.88 average answer relevancy across test queries measured by RAGAS framework",
      "GitHub Actions CI/CD with Ruff + Black linting and Bandit security scanning",
    ],
  },
  {
    _id: "project-cmi-bfrb",
    _type: "project",
    title: "CMI - Behavior Detection with Sensor Data",
    slug: { _type: "slug", current: "cmi_bfrb" },
    description:
      "Subject-independent gesture classifier for Body-Focused Repetitive Behaviors (hair-pulling, nail-biting) from a wrist-worn IMU+ToF device. SE-1D-CNN + bidirectional GRU architecture achieving 0.7868 macro+binary F1 across 81 subjects.",
    headline:
      "Subject-independent gesture classifier achieving 0.7868 F1 across 81 subjects from a wrist-worn sensor device",
    date: "Apr 2026",
    featured: false,
    tags: ["Deep Learning", "Time-Series", "Wearable Sensors"],
    techStack: ["Python", "PyTorch", "NumPy", "scikit-learn", "Kaggle"],
  },
  {
    _id: "project-reddit-pipeline",
    _type: "project",
    title: "Reddit Data Pipeline - ETL System",
    slug: { _type: "slug", current: "reddit_pipeline" },
    description:
      "End-to-end ETL pipeline ingesting 700+ daily posts across 14 subreddits with Kafka, Apache Airflow (6 DAGs), and multi-method anomaly detection (z-score, volume spike, TF-IDF + K-Means). Built for a Tesla data engineering interview.",
    headline:
      "ETL pipeline ingesting 700+ daily posts across 14 subreddits with anomaly detection surfacing product issues faster than support-ticket review",
    date: "Nov 2025",
    featured: false,
    tags: ["Data Engineering", "ETL", "AWS"],
    techStack: ["Apache Airflow", "Kafka", "AWS Redshift", "PostgreSQL", "Docker", "Python"],
  },
  {
    _id: "project-credit-risk",
    _type: "project",
    title: "Credit Risk Analysis Dashboard",
    slug: { _type: "slug", current: "credit_risk" },
    description:
      "PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications from the Home Credit Default Risk dataset. 45+ DAX measures, three-tier drill-down architecture, and SQL-driven aggregations - revealing that 34.6% of applications fall into high-risk segments.",
    headline:
      "PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications, replacing application-by-application Excel review",
    date: "Aug 2025",
    featured: false,
    tags: ["Business Intelligence", "Data Visualization", "Risk Analytics"],
    techStack: ["PowerBI", "DAX", "SQL", "Python", "Excel"],
  },
];

// ─────────────────────────────────────────────────────────────────
// 2. Helpers
// ─────────────────────────────────────────────────────────────────

async function wipeType(type: string) {
  const docs = await client.fetch<{ _id: string }[]>(`*[_type == $type]{ _id }`, { type });
  if (docs.length === 0) {
    console.log(`  (no ${type} documents to delete)`);
    return;
  }
  for (const { _id } of docs) {
    await client.delete(_id);
  }
  console.log(`  Deleted ${docs.length} ${type} document(s)`);
}

async function createDoc(doc: Record<string, unknown>) {
  await client.createOrReplace(doc);
  console.log(`  Created: ${doc._id}`);
}

// ─────────────────────────────────────────────────────────────────
// 3. Main
// ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n══════════════════════════════════════════");
  console.log("  Sanity Wipe & Seed");
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"}`);
  console.log("══════════════════════════════════════════\n");

  // ── Wipe ──────────────────────────────────────────
  console.log("Wiping existing documents...");
  await wipeType("project");
  await wipeType("experience");
  await wipeType("education");
  await wipeType("award");

  // ── Seed ──────────────────────────────────────────
  console.log("\nCreating experiences...");
  for (const doc of EXPERIENCES) await createDoc(doc);

  console.log("\nCreating education...");
  for (const doc of EDUCATION) await createDoc(doc);

  console.log("\nCreating awards...");
  for (const doc of AWARDS) await createDoc(doc);

  console.log("\nCreating projects...");
  for (const doc of PROJECTS) await createDoc(doc);

  console.log("\n══════════════════════════════════════════");
  console.log("  Done!");
  console.log("  Next steps:");
  console.log("  1. Open /studio and add cover images to projects");
  console.log("  2. Add award photos and links in the Awards section");
  console.log("  3. Write your first blog post in Studio > Post");
  console.log("══════════════════════════════════════════\n");
}

seed().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
