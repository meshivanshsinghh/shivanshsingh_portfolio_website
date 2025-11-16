export interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  logo?: string;
  location?: string;
  description?: string[];
  skills?: string[];
}

export const experiences: Experience[] = [
  {
    company: "Travlog Inc",
    role: "Software Engineer",
    period: "Jul 2023 - Jan 2025",
    type: "Full-time",
    location: "St. Petersburg, Florida, United States · Remote",
    description: [
      "Built and launched a cross-platform social travel app from scratch using Flutter, Firebase, and AWS, enabling users to document and share trips seamlessly across iOS and Android.",
      "Designed a scalable backend architecture with AWS Lambda, DynamoDB, and S3, supporting real-time features, efficient data handling, and push notifications.",
      "Continuously optimized app performance and UX through agile development and feedback loops, resulting in successful publication on both the App Store and Play Store."
    ],
    skills: ["Flutter", "AWS", "Firebase", "DynamoDB", "Lambda", "S3"]
  },
];