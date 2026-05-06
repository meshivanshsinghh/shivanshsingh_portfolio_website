export interface Award {
  id: string;
  title: string;
  org: string;
  sponsor?: string;
  date: string;
  note?: string;
  url?: string;
}

export const awards: Award[] = [
  {
    id: "codelinc10",
    title: "Technical Innovation Award",
    org: "CodeLinc10 - Lincoln Financial",
    sponsor: "Cognizant",
    date: "Oct 2025",
    note: "Solo entry, 40-hour hackathon, 800-mile bus ride from Boston to North Carolina",
  },
  {
    id: "fia-leadership",
    title: "Leadership & Influence Award",
    org: "Feminine Intelligence Agency (FIA)",
    date: "Dec 2025",
  },
];
