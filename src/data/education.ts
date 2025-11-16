export interface Education {
  school: string;
  degree: string;
  field: string;
  period: string;
  location?: string;
  logo?: string;
  gpa?: string;
}

export const education: Education[] = [
  {
    school: "Northeastern University",
    degree: "Master's degree",
    field: "Analytics",
    period: "Apr 2025 - Jul 2027",
    location: "Boston, Massachusetts, United States",
    gpa: "4.0",
  },
  {
    school: "International Institute of Information Technology Bangalore",
    degree: "PG Diploma",
    field: "Data Science",
    period: "2023 - 2024",
    location: "Bangalore, India",
  },
];
