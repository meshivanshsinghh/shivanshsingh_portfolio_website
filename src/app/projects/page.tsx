"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, Folder, Github, ExternalLink, Calendar } from "lucide-react";
import { projects as fallbackProjects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { SanityProject } from "@/types/sanity";
import { urlFor } from "@/lib/sanity";
import { getCachedData } from "@/lib/sanity-service";

export default function ProjectsArchivePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from cache or use fallback
  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData?.projects && cachedData.projects.length > 0) {
      setProjects(cachedData.projects);
    }
    setIsLoading(false);
  }, []);

  // Use Sanity projects if available, otherwise fallback
  const projectsData: SanityProject[] = projects.length > 0 ? projects : fallbackProjects.map((p, i) => ({
    _id: `fallback-${i}`,
    _createdAt: new Date().toISOString(),
    title: p.title,
    slug: { current: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
    description: p.description,
    date: p.date,
    tags: p.tags || [],
    link: p.link,
    githubUrl: undefined,
    featured: p.featured,
    coverImage: undefined,
  }));

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projectsData.forEach(project => {
      project.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projectsData]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || project.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag, projectsData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
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
        <div className="container max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-4">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              All <span className="text-primary">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              A collection of {fallbackProjects.length} projects I've worked on, ranging from AI/ML systems to full-stack applications.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
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
                All
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
            Showing {filteredProjects.length} of {projectsData.length} projects
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const slug = project.slug.current;
              
              // Get image URL if available
              let imageUrl: string | undefined;
              if (project.coverImage?.asset) {
                try {
                  imageUrl = urlFor(project.coverImage).width(600).height(400).url();
                } catch (error) {
                  console.error("Error generating image URL:", error);
                }
              }
              
              return (
              <Link
                key={project._id}
                href={`/projects/${slug}`}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Featured Image */}
                {imageUrl ? (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
                    <Folder className="h-16 w-16 text-primary/30" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Header with Links */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors flex-1 line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 ml-2">
                      {project.githubUrl && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View on GitHub"
                        >
                          <Github className="h-4 w-4" />
                        </button>
                      )}
                      {project.link && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.link, '_blank', 'noopener,noreferrer');
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View live demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Footer */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.date}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </Link>
            );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
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
