export interface Project {
    title: string;
    description: string;
    date: string;
    stars?: number;
    image?: string;
    tags?: string[];
    link?: string;
  }
  
  export const projects: Project[] = [
    {
      title: "AI Chatbot Application",
      description: "A conversational chatbot application built with Next.js and OpenAI. It leverages advanced NLP techniques for context-aware responses.",
      date: "Nov 2024",
      stars: 0,
      image: "/projects/chatbot.png",
      tags: ["Next.js", "OpenAI", "TypeScript"],
      link: "https://github.com/yourusername/chatbot",
    },
    {
      title: "Portfolio Website",
      description: "A modern, responsive personal portfolio website built with Next.js and Sanity.io. It showcases projects and blog posts.",
      date: "Oct 2024",
      stars: 0,
      image: "/projects/portfolio.png",
      tags: ["Next.js", "Sanity", "Tailwind CSS"],
      link: "https://github.com/yourusername/portfolio",
    },
    // Add more projects
  ];