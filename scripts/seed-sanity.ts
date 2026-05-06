/**
 * One-time seed script to populate Sanity with initial data from static files.
 *
 * Prerequisites:
 *   1. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 *      in your .env.local file.
 *   2. The SANITY_API_TOKEN must have Editor or Admin permissions.
 *
 * Run:
 *   npx tsx scripts/seed-sanity.ts
 *
 * This is safe to run multiple times — it checks for existing documents
 * before creating new ones (matching on a stable _id derived from the data).
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-11-09',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
const experiences = [
  {
    _id: 'experience-fia',
    _type: 'experience',
    company: 'Feminine Intelligence Agency (FIA)',
    role: 'Tech Lead',
    period: 'Jan 2026 - Present',
    type: 'Contract',
    location: 'Boston, MA',
    description: [
      'Lead a 30-student research team evaluating whether LLMs can detect psychological manipulation using a 28-trait UNES clinical psychology framework.',
      'Built a Python evaluation pipeline processing 170 Reddit relationship scenarios through GPT-4o, Claude, and DeepSeek, computing inter-rater reliability via Cohen\'s kappa.',
      'Models detect early danger reliably with a 2.25 Cohen\'s d effect size but fail at fine-grained classification with 19% accuracy across 17 manipulator player types.',
    ],
    skills: ['Python', 'GPT-4o', 'Claude', 'DeepSeek', 'NLP', 'Research'],
    order: 1,
  },
  {
    _id: 'experience-travlog',
    _type: 'experience',
    company: 'Travlog',
    role: 'Software Engineer',
    period: 'Jul 2023 - Jan 2025',
    type: 'Full-time',
    location: 'Remote - India',
    description: [
      'Built a modular social-media application for a YC-tracked startup for people trip planning alongside an offline-first SQLite storage layer across 15 schema iterations, later deployed to AWS cloud architecture.',
      'Engineered a monolithic backend API service using Kotlin and Node.js managing 40+ REST endpoints and a Firebase Cloud Messaging notification pipeline processing 500 tokens within 256MB memory limits.',
    ],
    skills: ['Flutter', 'Kotlin', 'Node.js', 'AWS', 'Firebase', 'SQLite'],
    order: 2,
  },
]

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
const education = [
  {
    _id: 'education-northeastern',
    _type: 'education',
    school: 'Northeastern University',
    degree: "Master's degree",
    field: 'Analytics',
    period: 'Apr 2025 - Dec 2026',
    location: 'Boston, Massachusetts, United States',
    gpa: '3.96',
    order: 1,
  },
  {
    _id: 'education-iiitb',
    _type: 'education',
    school: 'International Institute of Information Technology Bangalore',
    degree: 'PG Diploma',
    field: 'Data Science',
    period: 'May 2024 - Jan 2025',
    location: 'Bangalore, India',
    gpa: '3.7',
    order: 2,
  },
  {
    _id: 'education-lucknow',
    _type: 'education',
    school: 'University of Lucknow',
    degree: 'Bachelor of Business Administration',
    field: 'International Business',
    period: '2020 - 2023',
    location: 'Lucknow, India',
    order: 3,
  },
]

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------
const awards = [
  {
    _id: 'award-codelinc10',
    _type: 'award',
    title: 'Technical Innovation Award',
    org: 'CodeLinc10 - Lincoln Financial',
    sponsor: 'Cognizant',
    date: 'Oct 2025',
    note: 'Solo entry, 40-hour hackathon, 800-mile bus ride from Boston to North Carolina',
    order: 1,
  },
  {
    _id: 'award-fia-leadership',
    _type: 'award',
    title: 'Leadership & Influence Award',
    org: 'Feminine Intelligence Agency (FIA)',
    date: 'Dec 2025',
    order: 2,
  },
]

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const projects = [
  {
    _id: 'project-dermrx-agent',
    _type: 'project',
    title: 'DermRx Agent',
    slug: { _type: 'slug', current: 'dermrx_agent' },
    description:
      'Agentic clinical pipeline integrating MedSigLIP, MedGemma 4B, TxGemma 2B, and a 302K-interaction drug database - compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds.',
    headline:
      'Agentic clinical pipeline compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds',
    award: 'MedGemma Impact Challenge 2026',
    date: 'Feb 2026',
    featured: true,
    tags: ['Healthcare AI', 'LLM', 'RAG', 'Multi-Model'],
    techStack: ['Python', 'FastAPI', 'Next.js 15', 'PyTorch', 'MedGemma 4B', 'TxGemma 2B', 'MedSigLIP'],
    link: 'https://kaggle.com/competitions/med-gemma-impact-challenge/writeups/dermrx-agent',
    overview:
      'Agentic clinical pipeline integrating MedSigLIP, MedGemma 4B, TxGemma 2B, and a 302K-interaction drug database. Built for Google\'s MedGemma Impact Challenge 2026.',
    features: [
      'Three-tier clinical classification framework for 141 dermatological conditions into 22 actionable categories',
      'Evidence-based treatment formulary of 170 FDA-sourced drugs with cross-referenced drug interactions',
      'Parallel safety checking: DDInter pairwise screening + TxGemma molecular toxicity in under 60 seconds',
    ],
    technologies: [
      { _type: 'object', _key: '1', name: 'Python' },
      { _type: 'object', _key: '2', name: 'FastAPI' },
      { _type: 'object', _key: '3', name: 'Next.js 15' },
      { _type: 'object', _key: '4', name: 'PyTorch' },
      { _type: 'object', _key: '5', name: 'MedGemma 4B' },
      { _type: 'object', _key: '6', name: 'TxGemma 2B' },
    ],
  },
  {
    _id: 'project-ncaa',
    _type: 'project',
    title: 'NCAA March Madness Predictor',
    slug: { _type: 'slug', current: 'ncaa' },
    description:
      '29-feature XGBoost model blended against bookmaker odds for Kaggle\'s March Machine Learning Mania 2026 - finishing top 20% (rank 599) among 3,000+ competitors.',
    headline:
      'Top 20% finish (rank 599) among 3,000+ competitors with a 29-feature XGBoost model blended against bookmaker odds',
    award: 'Kaggle March Machine Learning Mania 2026',
    date: 'Mar 2026',
    featured: true,
    tags: ['Machine Learning', 'Sports Analytics', 'XGBoost'],
    techStack: ['Python', 'XGBoost', 'scikit-learn', 'pandas', 'NumPy', 'Google Colab'],
    overview:
      'End-to-end tournament prediction pipeline for Kaggle\'s March Machine Learning Mania 2026 (3,000+ competitors, $10K first prize).',
    features: [
      'Engineered 29 features including Elo ratings, GLM team quality estimates, and pace-adjusted box scores from 211,716 games',
      'Identified and fixed target leakage in spline calibration, reducing artificially optimistic CV scores',
      'Blended ML model with bookmaker odds at 75/25 ratio, optimized via backtesting against 2024-2025 results',
    ],
    technologies: [
      { _type: 'object', _key: '1', name: 'Python' },
      { _type: 'object', _key: '2', name: 'XGBoost' },
      { _type: 'object', _key: '3', name: 'scikit-learn' },
      { _type: 'object', _key: '4', name: 'pandas' },
    ],
  },
  {
    _id: 'project-rag-qa',
    _type: 'project',
    title: 'RAG Q&A System',
    slug: { _type: 'slug', current: 'rag_qa_system' },
    description:
      'Production retrieval-augmented Q&A pipeline using LangChain LCEL, OpenAI embeddings, and Qdrant Cloud with RAGAS evaluation and CI/CD to AWS App Runner.',
    headline:
      'Production RAG pipeline with automated evaluation, full-chain observability, and CI/CD to AWS',
    date: 'Apr 2026',
    featured: true,
    tags: ['AI Systems', 'Production ML', 'RAG'],
    techStack: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'Qdrant', 'Docker', 'AWS'],
    overview:
      'Production-grade RAG Q&A system with real evaluation (RAGAS faithfulness/relevancy on every query), LangSmith observability, and a CD pipeline to AWS App Runner.',
    features: [
      'LangChain LCEL pipeline with OpenAI text-embedding-3-small and Qdrant Cloud vector store',
      '0.88 average answer relevancy across test queries measured by RAGAS framework',
      'GitHub Actions CI/CD with Ruff + Black linting and Bandit security scanning',
    ],
    technologies: [
      { _type: 'object', _key: '1', name: 'Python 3.12' },
      { _type: 'object', _key: '2', name: 'FastAPI' },
      { _type: 'object', _key: '3', name: 'LangChain (LCEL)' },
      { _type: 'object', _key: '4', name: 'OpenAI API' },
      { _type: 'object', _key: '5', name: 'Qdrant Cloud' },
      { _type: 'object', _key: '6', name: 'Docker' },
    ],
  },
  {
    _id: 'project-cmi-bfrb',
    _type: 'project',
    title: 'CMI - Behavior Detection with Sensor Data',
    slug: { _type: 'slug', current: 'cmi_bfrb' },
    description:
      'Subject-independent gesture classifier achieving 0.7868 macro+binary F1 across 81 subjects and 8,151 sequences from a wrist-worn IMU+ToF sensor device.',
    headline:
      'Subject-independent gesture classifier achieving 0.7868 F1 across 81 subjects from a wrist-worn sensor device',
    date: 'Apr 2026',
    featured: false,
    tags: ['Deep Learning', 'Time-Series', 'Wearable Sensors'],
    techStack: ['Python', 'PyTorch', 'NumPy', 'scikit-learn', 'Kaggle'],
    overview:
      'SE-1D-CNN + bidirectional GRU model for classifying Body-Focused Repetitive Behaviors from a wrist-worn device.',
    technologies: [
      { _type: 'object', _key: '1', name: 'Python' },
      { _type: 'object', _key: '2', name: 'PyTorch' },
      { _type: 'object', _key: '3', name: 'NumPy' },
      { _type: 'object', _key: '4', name: 'scikit-learn' },
    ],
  },
  {
    _id: 'project-reddit-pipeline',
    _type: 'project',
    title: 'Reddit Data Pipeline - ETL System',
    slug: { _type: 'slug', current: 'reddit_pipeline' },
    description:
      'ETL pipeline ingesting 700+ daily posts across 14 subreddits with Kafka, Apache Airflow, and multi-method anomaly detection.',
    headline:
      'ETL pipeline ingesting 700+ daily posts with anomaly detection surfacing product issues faster than support-ticket review',
    date: 'Nov 2025',
    featured: false,
    tags: ['Data Engineering', 'ETL', 'AWS'],
    techStack: ['Apache Airflow', 'Kafka', 'AWS Redshift', 'PostgreSQL', 'Docker', 'Python'],
    overview:
      'Built for a Tesla data engineering interview. Ingests product-discussion subreddits and runs sentiment and anomaly detection to surface issues for a PM dashboard.',
    technologies: [
      { _type: 'object', _key: '1', name: 'Apache Airflow' },
      { _type: 'object', _key: '2', name: 'Kafka' },
      { _type: 'object', _key: '3', name: 'AWS Redshift' },
      { _type: 'object', _key: '4', name: 'PostgreSQL' },
      { _type: 'object', _key: '5', name: 'Docker' },
    ],
  },
  {
    _id: 'project-credit-risk',
    _type: 'project',
    title: 'Credit Risk Analysis Dashboard',
    slug: { _type: 'slug', current: 'credit_risk' },
    description:
      'PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications, revealing 34.6% of applications fall into high-risk segments.',
    headline:
      'PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications, replacing application-by-application Excel review',
    date: 'Aug 2025',
    featured: false,
    tags: ['Business Intelligence', 'Data Visualization', 'Risk Analytics'],
    techStack: ['PowerBI', 'DAX', 'SQL', 'Python', 'Excel'],
    overview:
      'Coursework project using the Home Credit Default Risk dataset. 45+ DAX measures and three-tier drill-down architecture.',
    technologies: [
      { _type: 'object', _key: '1', name: 'PowerBI' },
      { _type: 'object', _key: '2', name: 'DAX' },
      { _type: 'object', _key: '3', name: 'SQL' },
      { _type: 'object', _key: '4', name: 'Python' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Seeding helpers
// ---------------------------------------------------------------------------
async function upsertDocument(doc: Record<string, unknown>) {
  const existing = await client.getDocument(doc._id as string)
  if (existing) {
    console.log(`  Skipping (already exists): ${doc._id}`)
    return
  }
  await client.createOrReplace(doc)
  console.log(`  Created: ${doc._id}`)
}

async function seed() {
  console.log('\nSeeding Sanity...\n')

  console.log('Experience:')
  for (const doc of experiences) await upsertDocument(doc)

  console.log('\nEducation:')
  for (const doc of education) await upsertDocument(doc)

  console.log('\nAwards:')
  for (const doc of awards) await upsertDocument(doc)

  console.log('\nProjects:')
  for (const doc of projects) await upsertDocument(doc)

  console.log('\nDone! Open /studio to review and add cover images to projects.\n')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
