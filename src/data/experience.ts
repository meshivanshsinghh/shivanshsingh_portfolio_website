export interface Experience {
    company: string;
    role: string;
    period: string;
    type: string;
    logo?: string;
  }
  
  export const experiences: Experience[] = [
    {
      company: "Company Name",
      role: "AI/ML Engineer",
      period: "Jan 2024 - Present",
      type: "Full-time",
      logo: "/logos/company1.png", // Add your logo to public/logos/
    },
    {
      company: "Previous Company",
      role: "Software Engineer",
      period: "Jun 2022 - Dec 2023",
      type: "Full-time",
      logo: "/logos/company2.png",
    },
    // Add more experiences
  ];