import { client } from "./sanity";
import { SanityData } from "@/types/sanity";

const CACHE_KEY = "portfolio_sanity_data";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const PORTFOLIO_QUERY = `{
  "projects": *[_type == "project"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    date,
    tags,
    link,
    githubUrl,
    image,
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
    coverImage
  },
  "announcement": *[_type == "announcement"][0] {
    _id,
    isActive,
    text,
    link,
    linkText,
    variant
  }
}`;

// server side fetch with nextjs caching
export async function fetchPortfolioData(): Promise<SanityData> {
  try {
    const isDevelopment = process.env.NODE_ENV === "development";

    const data = await client.fetch<SanityData>(
      PORTFOLIO_QUERY,
      {},
      isDevelopment
        ? {
            // Development: no caching
            cache: "no-store",
          }
        : {
            // Production: use caching
            next: {
              revalidate: 3600,
              tags: ["portfolio"],
            },
          }
    );
    return data;
  } catch (error) {
    console.error("Error fetching Sanity data:", error);
    return {
      projects: [],
      blogPosts: [],
    };
  }
}

// client side caching utilities
export function getCachedData(): SanityData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // checking if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // cache expired, removing it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.log("Error reading cache: ", error);
    return null;
  }
}

export function setCachedData(data: SanityData): void {
  if (typeof window === "undefined") return;

  try {
    const cachedObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedObject));
  } catch (error) {
    console.error("Error setting cache: ", error);
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}
