"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { blogPosts as fallbackBlogPosts } from "@/data/blog-posts";
import { SanityBlogPost } from "@/types/sanity";
import { getCachedData } from "@/lib/sanity-service";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sanityPosts, setSanityPosts] = useState<SanityBlogPost[]>([]);

  useEffect(() => {
    const cached = getCachedData();
    if (cached?.blogPosts && cached.blogPosts.length > 0) {
      setSanityPosts(cached.blogPosts);
    }
  }, []);

  const postsData = useMemo(() => {
    if (sanityPosts.length > 0) return sanityPosts;
    return fallbackBlogPosts as unknown as SanityBlogPost[];
  }, [sanityPosts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    postsData.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [postsData]);

  const filtered = useMemo(() => {
    return postsData
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [postsData, searchQuery, selectedTag]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Writing</h1>
        <p className="text-sm text-muted-foreground">
          Thoughts on ML systems, software engineering, and applied research.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              !selectedTag
                ? "bg-foreground text-white border-foreground"
                : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            All topics
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                selectedTag === tag
                  ? "bg-foreground text-white border-foreground"
                  : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length} of {postsData.length} posts
      </p>

      {/* Posts list */}
      <div className="space-y-0 divide-y divide-border">
        {filtered.map((post, index) => {
          const slug =
            typeof post.slug === "object" ? post.slug.current : (post.slug as unknown as string);
          const date = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : (post as unknown as { date?: string }).date ?? "";

          return (
            <Link
              key={post._id ?? index}
              href={`/blog/${slug}`}
              className="flex items-start justify-between gap-4 py-5 group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug mb-1">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                {date}
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground mb-3">No posts match your search.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
            className="text-xs text-foreground underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
