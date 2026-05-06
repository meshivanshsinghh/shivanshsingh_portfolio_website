export interface Project {
  id: string;
  title: string;
  description: string;
  headline: string;
  date: string;
  tags: string[];
  techStack: string[];
  link?: string;
  featured?: boolean;
  award?: string;
}

export const projects: Project[] = [
  {
    id: "dermrx_agent",
    title: "DermRx Agent",
    description:
      "Agentic clinical pipeline integrating MedSigLIP, MedGemma 4B, TxGemma 2B, and a 302K-interaction drug database - compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds.",
    headline:
      "Agentic clinical pipeline compressing cross-specialty drug interaction checks from 5-10 minute manual lookups to under 60 seconds",
    date: "Feb 2026",
    tags: ["Healthcare AI", "LLM", "RAG", "Multi-Model"],
    techStack: ["Python", "FastAPI", "Next.js 15", "PyTorch", "MedGemma 4B", "TxGemma 2B", "MedSigLIP"],
    link: "https://kaggle.com/competitions/med-gemma-impact-challenge/writeups/dermrx-agent",
    featured: true,
    award: "MedGemma Impact Challenge 2026",
  },
  {
    id: "ncaa",
    title: "NCAA March Madness Predictor",
    description:
      "End-to-end tournament prediction pipeline for Kaggle's March Machine Learning Mania 2026. 29-feature XGBoost model incorporating Elo ratings, GLM team quality estimates, and pace-adjusted box scores from 211,716 regular season games — finishing top 20% (rank 599) among 3,000+ competitors.",
    headline:
      "Top 20% finish (rank 599) among 3,000+ competitors with a 29-feature XGBoost model blended against bookmaker odds",
    date: "Mar 2026",
    tags: ["Machine Learning", "Sports Analytics", "XGBoost"],
    techStack: ["Python", "XGBoost", "scikit-learn", "pandas", "NumPy", "Google Colab"],
    featured: true,
    award: "Kaggle March Machine Learning Mania 2026",
  },
  {
    id: "rag_qa_system",
    title: "RAG Q&A System",
    description:
      "Production retrieval-augmented Q&A pipeline using LangChain LCEL, OpenAI embeddings, and Qdrant Cloud. Includes automated RAGAS evaluation, LangSmith full-chain observability, and CI/CD to AWS App Runner via GitHub Actions.",
    headline:
      "Production RAG pipeline with automated evaluation, full-chain observability, and CI/CD to AWS",
    date: "Apr 2026",
    tags: ["AI Systems", "Production ML", "RAG"],
    techStack: ["Python", "FastAPI", "LangChain", "OpenAI", "Qdrant", "Docker", "AWS"],
    featured: true,
  },
  {
    id: "cmi_bfrb",
    title: "CMI - Behavior Detection with Sensor Data",
    description:
      "Subject-independent gesture classifier for Body-Focused Repetitive Behaviors (hair-pulling, nail-biting) from a wrist-worn IMU+ToF device. SE-1D-CNN + bidirectional GRU architecture achieving 0.7868 macro+binary F1 across 81 subjects.",
    headline:
      "Subject-independent gesture classifier achieving 0.7868 F1 across 81 subjects from a wrist-worn sensor device",
    date: "Apr 2026",
    tags: ["Deep Learning", "Time-Series", "Wearable Sensors"],
    techStack: ["Python", "PyTorch", "NumPy", "scikit-learn", "Kaggle"],
    featured: false,
  },
  {
    id: "reddit_pipeline",
    title: "Reddit Data Pipeline - ETL System",
    description:
      "End-to-end ETL pipeline ingesting 700+ daily posts across 14 subreddits with Kafka, Apache Airflow (6 DAGs), and multi-method anomaly detection (z-score, volume spike, TF-IDF + K-Means). Built for a Tesla data engineering interview.",
    headline:
      "ETL pipeline ingesting 700+ daily posts across 14 subreddits with anomaly detection surfacing product issues faster than support-ticket review",
    date: "Nov 2025",
    tags: ["Data Engineering", "ETL", "AWS"],
    techStack: ["Apache Airflow", "Kafka", "AWS Redshift", "PostgreSQL", "Docker", "Python"],
    featured: false,
  },
  {
    id: "credit_risk",
    title: "Credit Risk Analysis Dashboard",
    description:
      "PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications from the Home Credit Default Risk dataset. 45+ DAX measures, three-tier drill-down architecture, and SQL-driven aggregations — revealing that 34.6% of applications fall into high-risk segments.",
    headline:
      "PowerBI dashboard surfacing portfolio-level risk across 307,511 loan applications, replacing application-by-application Excel review",
    date: "Aug 2025",
    tags: ["Business Intelligence", "Data Visualization", "Risk Analytics"],
    techStack: ["PowerBI", "DAX", "SQL", "Python", "Excel"],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
