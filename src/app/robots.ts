import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Allow crawling everywhere so Google can follow links to blog posts.
        // Individual non-blog pages declare <meta name="robots" content="noindex">
        // via their layout.tsx files — that controls indexing, not this file.
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: "https://shivanshsingh.in/sitemap.xml",
  };
}
