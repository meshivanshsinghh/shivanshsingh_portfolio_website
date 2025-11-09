export interface BlogPost {
    title: string;
    description: string;
    date: string;
    views?: number;
    tags: string[];
    slug: string;
  }
  
  export const blogPosts: BlogPost[] = [
    {
      title: "Getting Started with Next.js 15",
      description: "Learn how to build modern web applications with Next.js 15, including the new App Router and Server Components.",
      date: "Mar 18, 2024",
      views: 1250,
      tags: ["nextjs", "react", "web development"],
      slug: "getting-started-nextjs-15",
    },
    {
      title: "Building AI Applications with OpenAI",
      description: "A comprehensive guide to integrating OpenAI's API into your applications for intelligent features.",
      date: "Feb 27, 2024",
      views: 890,
      tags: ["ai", "openai", "machine learning"],
      slug: "building-ai-applications-openai",
    },
    // Add more blog posts
  ];