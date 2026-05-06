import { client } from "./sanity";
import { SanityData } from "@/types/sanity";

const CACHE_KEY = "portfolio_sanity_data";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const PORTFOLIO_QUERY = `{
  "projects": *[_type == "project"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    description,
    headline,
    techStack,
    award,
    date,
    tags,
    link,
    githubUrl,
    coverImage,
    featured
  },
  "blogPosts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    description,
    publishedAt,
    tags,
    seoTitle,
    readingTime,
    coverImage
  },
  "experiences": *[_type == "experience"] | order(order asc) {
    _id,
    company,
    role,
    period,
    type,
    location,
    description,
    skills,
    order
  },
  "educations": *[_type == "education"] | order(order asc) {
    _id,
    school,
    degree,
    field,
    period,
    location,
    gpa,
    order
  },
  "awards": *[_type == "award"] | order(order asc) {
    _id,
    title,
    org,
    sponsor,
    date,
    note,
    url,
    order
  }
}`;

export async function fetchPortfolioData(): Promise<SanityData> {
  try {
    const isDevelopment = process.env.NODE_ENV === "development";

    const data = await client.fetch<SanityData>(
      PORTFOLIO_QUERY,
      {},
      isDevelopment
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: ["portfolio"] } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching Sanity data:", error);
    return {
      projects: [],
      blogPosts: [],
      experiences: [],
      educations: [],
      awards: [],
    };
  }
}

export function getCachedData(): SanityData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) return data;

    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function setCachedData(data: SanityData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // silent
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}
