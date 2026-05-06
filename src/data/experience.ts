export interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  location?: string;
  description?: string[];
  skills?: string[];
}

export const experiences: Experience[] = [
  {
    company: "Feminine Intelligence Agency (FIA)",
    role: "Tech Lead",
    period: "Jan 2026 – Present",
    type: "Contract",
    location: "Boston, MA",
    description: [
      "Lead a 30-student research team evaluating whether LLMs can detect psychological manipulation using a 28-trait UNES clinical psychology framework.",
      "Built a Python evaluation pipeline processing 170 Reddit relationship scenarios through GPT-4o, Claude, and DeepSeek, computing inter-rater reliability via Cohen's kappa.",
      "Models detect early danger reliably with a 2.25 Cohen's d effect size but fail at fine-grained classification with 19% accuracy across 17 manipulator player types.",
    ],
    skills: ["Python", "GPT-4o", "Claude", "DeepSeek", "NLP", "Research"],
  },
  {
    company: "Travlog",
    role: "Software Engineer",
    period: "Jul 2023 – Jan 2025",
    type: "Full-time",
    location: "Remote – India",
    description: [
      "Built a modular social-media application for a YC-tracked startup for people trip planning alongside an offline-first SQLite storage layer across 15 schema iterations, later deployed to AWS cloud architecture.",
      "Engineered a monolithic backend API service using Kotlin and Node.js managing 40+ REST endpoints and a Firebase Cloud Messaging notification pipeline processing 500 tokens within 256MB memory limits.",
    ],
    skills: ["Flutter", "Kotlin", "Node.js", "AWS", "Firebase", "SQLite"],
  },
];
