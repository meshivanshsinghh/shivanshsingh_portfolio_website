"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, Clock, TrendingUp, Tag } from "lucide-react";
import { blogPosts as fallbackBlogPosts } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";

export default function BlogArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "views">("date");

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    fallbackBlogPosts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = fallbackBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    // Sort posts
    if (sortBy === "views") {
      posts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      posts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return posts;
  }, [searchQuery, selectedTag, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Blog <span className="text-primary">Posts</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Thoughts on software development, AI/ML, and building scalable systems.
            </p>
          </div>

          {/* Search, Filter, and Sort */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "views")}
                className="px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="date">Latest First</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !selectedTag
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/30 text-muted-foreground hover:bg-card/50"
                }`}
              >
                All Topics
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/30 text-muted-foreground hover:bg-card/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {fallbackBlogPosts.length} posts
          </div>

          {/* Blog Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <Link
                key={index}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {post.description}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.date}
                        </div>
                        {post.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {post.views} views
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          5 min read
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
