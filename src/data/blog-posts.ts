export interface BlogPost {
  title: string;
  description: string;
  date: string;
  views?: number;
  tags: string[];
  slug: string;
}

// Fallback data when Sanity is not available
export const blogPosts: BlogPost[] = [
  {
    title: "Building Scalable Data Pipelines with AWS",
    description: "Learn how to architect and implement large-scale ETL systems using AWS services like Glue, Athena, and Redshift.",
    date: "Nov 2024",
    views: 0,
    tags: ["aws", "data-engineering", "etl"],
    slug: "building-scalable-data-pipelines-aws",
  },
  {
    title: "AI-Powered Sentiment Analysis at Scale",
    description: "A deep dive into processing and analyzing 100K+ daily social media posts for sentiment insights.",
    date: "Oct 2024",
    views: 0,
    tags: ["ai", "nlp", "machine-learning"],
    slug: "ai-powered-sentiment-analysis",
  },
];