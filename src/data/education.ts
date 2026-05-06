export interface Education {
  school: string;
  degree: string;
  field: string;
  period: string;
  location?: string;
  gpa?: string;
}

export const education: Education[] = [
  {
    school: "Northeastern University",
    degree: "Master's degree",
    field: "Analytics",
    period: "Apr 2025 - Dec 2026",
    location: "Boston, Massachusetts, United States",
    gpa: "3.96",
  },
  {
    school: "International Institute of Information Technology Bangalore",
    degree: "PG Diploma",
    field: "Data Science",
    period: "May 2024 - Jan 2025",
    location: "Bangalore, India",
    gpa: "3.7",
  },
  {
    school: "University of Lucknow",
    degree: "Bachelor of Business Administration",
    field: "International Business",
    period: "2020 - 2023",
    location: "Lucknow, India",
  },
];
