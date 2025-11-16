"use client";

import Link from "next/link";
import { Code2, Folder, Github, ExternalLink } from "lucide-react";
import { projects as fallbackProjects } from "@/data/projects";
import { SanityProject } from "@/types/sanity";
import { urlFor } from "@/lib/sanity";

interface WorkSectionProps {
  projects?: SanityProject[];
}

// Extended type for mapped projects
type MappedProject = SanityProject & {
  category: string;
  github?: string;
  demo?: string;
};

type FallbackMappedProject = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  category: string;
  github?: string;
  demo?: string;
  featured: boolean;
};

// Helper function to map projects to include category
function mapProjectWithCategory(project: SanityProject): MappedProject {
  let category = "software";
  if (
    project.tags?.some(
      (tag) =>
        tag.toLowerCase().includes("ai") ||
        tag.toLowerCase().includes("ml") ||
        tag.toLowerCase().includes("nlp")
    )
  ) {
    category = "ai-ml";
  }

  return {
    ...project,
    category,
    github: project.githubUrl,
    demo: project.link,
    featured: project.featured ?? true,
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function WorkSection({ projects: sanityProjects }: WorkSectionProps) {
  // Use Sanity projects if available, otherwise use fallback
  const projectsData: (MappedProject | FallbackMappedProject)[] =
    sanityProjects && sanityProjects.length > 0
      ? sanityProjects.map(mapProjectWithCategory)
      : fallbackProjects.map((p, i) => ({
          title: p.title,
          description: p.description,
          date: p.date,
          tags: p.tags,
          category: i === 0 ? "ai-ml" : "software",
          github: p.link,
          demo: p.link,
          featured: p.featured ?? false,
        }));

  // Separate featured and non-featured projects
  const featuredProjects = projectsData.filter((p) => p.featured);
  const otherProjects = projectsData.filter((p) => !p.featured).slice(0, 6);

  return (
    <section className="py-20">
      <div className="container max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-4">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Work</span>
          </div>
          <h2 className="text-3xl md:text-3xl font-bold tracking-tight mb-2">
            Some Things I've <span className="text-primary">Built</span>
          </h2>
        </div>

        {/* Featured Projects - Large Cards with Images */}
        {featuredProjects.length > 0 && (
          <div className="space-y-20 mb-20">
            {featuredProjects.map((project, index) => {
              const projectKey = "_id" in project ? project._id : `featured-${index}`;
              const slug =
                "slug" in project && project.slug
                  ? project.slug.current
                  : generateSlug(project.title);
              const hasDetailPage = "_id" in project;

              // Get image URL
              let imageUrl: string | undefined;
              const imageField = "coverImage" in project ? project.coverImage : undefined;
              if (imageField && typeof imageField === "object" && "asset" in imageField) {
                try {
                  imageUrl = urlFor(imageField).width(1200).height(600).url();
                } catch (error) {
                  console.error("Error generating image URL:", error);
                }
              }

              const isEven = index % 2 === 0;

              const content = (
                <div className="group relative">
                  <div
                    className={`grid md:grid-cols-2 gap-8 items-center ${
                      isEven ? "" : "md:grid-flow-dense"
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-card/30 border border-border/50 group-hover:border-primary/30 transition-all ${
                        isEven ? "" : "md:col-start-2"
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                          <span className="text-6xl font-bold text-primary/30">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`space-y-4 ${isEven ? "" : "md:col-start-1 md:row-start-1"}`}>
                      <div className="text-sm text-primary font-medium">Featured Project</div>
                      <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {project.tags?.map((tag) => (
                          <span key={tag} className="text-sm text-muted-foreground font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 pt-2">
                        {project.github && (
                          hasDetailPage ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(project.github, '_blank', 'noopener,noreferrer');
                              }}
                              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                              aria-label="View on GitHub"
                            >
                              <Github className="h-6 w-6" />
                            </button>
                          ) : (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                              aria-label="View on GitHub"
                            >
                              <Github className="h-6 w-6" />
                            </a>
                          )
                        )}
                        {project.demo && (
                          hasDetailPage ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(project.demo, '_blank', 'noopener,noreferrer');
                              }}
                              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                              aria-label="View live demo"
                            >
                              <ExternalLink className="h-6 w-6" />
                            </button>
                          ) : (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                              aria-label="View live demo"
                            >
                              <ExternalLink className="h-6 w-6" />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );

              return hasDetailPage ? (
                <Link key={projectKey} href={`/projects/${slug}`} className="block">
                  {content}
                </Link>
              ) : (
                <div key={projectKey}>{content}</div>
              );
            })}
          </div>
        )}

        {/* Other Noteworthy Projects - Grid Cards */}
        {otherProjects.length > 0 && (
          <>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold">
                Other Noteworthy <span className="text-primary">Projects</span>
              </h3>
              <Link
                href="/projects"
                className="inline-block text-primary hover:underline text-sm mt-2"
              >
                view the archive
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {otherProjects.map((project, index) => {
            // Determine unique key
            const projectKey = "_id" in project ? project._id : `fallback-${index}`;

            // Get slug for linking
            const slug =
              "slug" in project && project.slug
                ? project.slug.current
                : generateSlug(project.title);

            // Determine if project has a detail page (only Sanity projects)
            const hasDetailPage = "_id" in project;

            const cardContent = (
              <div className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Header with Folder and Links */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Folder className="h-8 w-8" />
                  </div>
                  <div className="flex gap-2">
                    {project.github && (
                      hasDetailPage ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.github, '_blank', 'noopener,noreferrer');
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View on GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </button>
                      ) : (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View on GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )
                    )}
                    {project.demo && (
                      hasDetailPage ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.demo, '_blank', 'noopener,noreferrer');
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View live demo"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                      ) : (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-all hover:scale-110"
                          aria-label="View live demo"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags?.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </div>
            );

            // Wrap in Link if it's a Sanity project with detail page
            return hasDetailPage ? (
              <Link key={projectKey} href={`/projects/${slug}`} className="block">
                {cardContent}
              </Link>
            ) : (
              <div key={projectKey}>{cardContent}</div>
            );
          })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
