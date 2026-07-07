export interface SanityProject {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  description: string;
  overview?: string;
  date: string;
  tags: string[];
  headline?: string;
  techStack?: string[];
  award?: string;
  technologies?: Array<{ name: string; url?: string }>;
  features?: string[];
  link?: string;
  githubUrl?: string;
  coverImage?: { asset: { _ref: string; _type: string } };
  gallery?: Array<{ asset: { _ref: string; _type: string }; alt?: string; caption?: string }>;
  body?: unknown;
  featured?: boolean;
}

export interface SanityBlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  description: string;
  publishedAt: string;
  tags: string[];
  views?: number;
  body: unknown;
  seoTitle?: string;
  readingTime?: number;
  coverImage?: { asset: { _ref: string; _type: string }; alt?: string };
}

export interface SanityExperience {
  _id: string;
  company: string;
  role: string;
  period: string;
  type: string;
  location?: string;
  description?: string[];
  skills?: string[];
  order: number;
}

export interface SanityEducation {
  _id: string;
  school: string;
  degree: string;
  field: string;
  period: string;
  location?: string;
  gpa?: string;
  order: number;
}

export interface SanityAward {
  _id: string;
  title: string;
  org: string;
  sponsor?: string;
  date: string;
  note?: string;
  image?: { asset: { _ref: string; _type: string }; hotspot?: unknown };
  gallery?: Array<{ asset: { _ref: string; _type: string }; hotspot?: unknown }>;
  url?: string;
  linkLabel?: string;
  order: number;
  bentoSize?: 'large' | 'wide' | 'square';
}

export interface SanityAnnouncement {
  _id: string;
  isActive: boolean;
  text: string;
  link?: string;
  linkText?: string;
  variant: "info" | "success" | "warning";
}

export interface SanityData {
  projects: SanityProject[];
  blogPosts: SanityBlogPost[];
  experiences: SanityExperience[];
  educations: SanityEducation[];
  awards: SanityAward[];
  announcement?: SanityAnnouncement;
}
