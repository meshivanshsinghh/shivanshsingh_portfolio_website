export interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  logo?: string;
  description?: string[];
}

export const experiences: Experience[] = [
  {
    company: "Travlog Inc",
    role: "Software Engineer",
    period: "Jul 2023 - Jan 2025",
    type: "Full-time",
    description: [
      "Architected backend infrastructure on AWS (Lambda, S3, DynamoDB) to support a scalable social travel app across Android and iOS platforms, maintaining 99.9% uptime.",
      "Led end-to-end product development for Flutter and enforced image-based sentiment analysis pipeline using a trained deep learning model to classify user-uploaded photos with over 90% accuracy.",
      "Applied in-app analytics tools to monitor behavior and drive future feature planning. Delivered performance-optimized MVP in 4 months, contributing to the company's Y Combinator application."
    ]
  },
  {
    company: "Northeastern University",
    role: "Graduate Student",
    period: "Apr 2025 - Dec 2026",
    type: "Education",
    description: [
      "Master of Professional Studies in Analytics (GPA: 4.0)"
    ]
  }
];