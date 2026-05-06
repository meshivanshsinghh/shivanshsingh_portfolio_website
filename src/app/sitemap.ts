import { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

const BASE_URL = "https://shivanshsingh.in";

async function getBlogPosts(): Promise<{ slug: string; publishedAt: string }[]> {
  try {
    return await client.fetch<{ slug: string; publishedAt: string }[]>(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`,
      {},
      { next: { revalidate: 3600 } }
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();

  // Only the landing page and individual blog posts are indexed.
  // /about, /projects, /work/* use noindex meta tags (see their layout.tsx files).
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...blogPosts.map(({ slug, publishedAt }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
  ];
}
