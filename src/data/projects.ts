export interface Project {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  link?: string;
  featured?: boolean;
}

// Fallback data when Sanity is not available
export const projects: Project[] = [
  {
    title: "FinAI - Personal Finance AI Assistant",
    description: "Developed an intelligent personalization engine to enhance user experience by analyzing lifestyle data, translating complex information into clear, actionable insights for users.",
    date: "Oct 2025",
    tags: ["API", "AI", "AWS", "Lambda", "S3", "Cognito", "Flutter"],
    link: "https://devpost.com/software/finai-eld73o",
    featured: true,
  },
  {
    title: "Reddit Data Pipeline - ETL System",
    description: "Engineered an automated data pipeline to extract and analyze Reddit community sentiment from 100K+ daily posts, delivering actionable insights to stakeholders.",
    date: "Aug 2025",
    tags: ["AWS", "S3", "Glue", "Redshift", "Athena", "Apache Airflow"],
    featured: true,
  },
  {
    title: "OpinionFlow - AI Review Analysis",
    description: "Developed a data-driven system providing actionable insights from thousands of customer reviews using semantic search and NLP.",
    date: "May 2025",
    tags: ["Gemini Flash", "Pinecone", "Semantic Search", "NLP", "MLflow"],
    featured: false,
  },
];