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
  views?: number;  // Add this line
  body: any; // Portable text
  coverImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

export interface SanityData {
  projects: SanityProject[];
  blogPosts: SanityBlogPost[];
}