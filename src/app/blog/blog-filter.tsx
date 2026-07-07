"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { MediumPost } from "@/lib/medium";

export default function BlogFilter({ posts }: { posts: MediumPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return posts.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      const matchesTag = !selectedTag || p.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-muted-foreground placeholder:text-muted-foreground shadow-sm"
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              !selectedTag
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
            }`}
          >
            All topics
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedTag === tag
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length} of {posts.length} posts &middot; hosted on Medium
      </p>

      {/* Posts list */}
      <div className="space-y-0 divide-y divide-border">
        {filtered.map((post) => {
          const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          return (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 py-5 group hover:bg-secondary/50 -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors leading-snug mb-1 flex items-center gap-1.5">
                  {post.title}
                  <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </p>
                {post.excerpt && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-secondary text-foreground border border-border rounded"
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
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground mb-3">No posts match your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTag(null);
            }}
            className="text-xs text-foreground underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
