import { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

const BASE_URL = "https://shivanshsingh.in";

async function getBlogSlugs(): Promise<string[]> {
  try {
    return await client.fetch<string[]>(
      `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }.slug`,
      {},
      { next: { revalidate: 3600 } }
    );
  } catch {
    return [];
  }
}

async function getProjectSlugs(): Promise<string[]> {
  try {
    return await client.fetch<string[]>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }.slug`,
      {},
      { next: { revalidate: 3600 } }
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, projectSlugs] = await Promise.all([getBlogSlugs(), getProjectSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
