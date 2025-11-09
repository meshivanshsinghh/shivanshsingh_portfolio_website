export interface SanityProject {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  link?: string;
  githubUrl?: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
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
}
