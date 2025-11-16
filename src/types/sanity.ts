export interface SanityProject {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  overview?: string;
  date: string;
  tags: string[];
  technologies?: Array<{
    name: string;
    url?: string;
  }>;
  features?: string[];
  link?: string;
  githubUrl?: string;
  coverImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  gallery?: Array<{
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
    caption?: string;
  }>;
  body?: any;
  featured?: boolean;
}
export interface SanityBlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  publishedAt: string;
  tags: string[];
  views?: number;
  body: any;
  coverImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
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
  announcement?: SanityAnnouncement;
}
