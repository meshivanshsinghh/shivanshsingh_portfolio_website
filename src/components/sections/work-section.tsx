"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Brain, Wrench, Github, ExternalLink } from "lucide-react";
import { projects as fallbackProjects } from "@/data/projects";
import { SanityProject } from "@/types/sanity";
import { urlFor } from "@/lib/sanity";

const categories = [
  { id: "all", label: "All Projects", icon: Code2 },
  { id: "ai-ml", label: "AI/ML", icon: Brain },
  { id: "software", label: "Software Engineering", icon: Wrench },
];

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
  image?: string;
  category: string;
  github?: string;
  demo?: string;
  featured: boolean;
};

// Helper function to map projects to include category
function mapProjectWithCategory(project: SanityProject, index: number): MappedProject {
  // Determine category based on tags or index
  let category = "software";
  if (project.tags?.some(tag => 
    tag.toLowerCase().includes("ai") || 
    tag.toLowerCase().includes("ml") || 
    tag.toLowerCase().includes("nlp")
  )) {
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

export default function WorkSection({ projects: sanityProjects }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Use Sanity projects if available, otherwise use fallback
  const projectsData: (MappedProject | FallbackMappedProject)[] = sanityProjects && sanityProjects.length > 0 
    ? sanityProjects.map(mapProjectWithCategory)
    : fallbackProjects.map((p, i) => ({
        title: p.title,
        description: p.description,
        date: p.date,
        tags: p.tags,
        image: p.image,
        category: i === 0 ? "ai-ml" : "software",
        github: p.link,
        demo: p.link,
        featured: true,
      }));

  // Filter projects by category
  const filteredProjects =
    activeCategory === "all"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);
  
  return (
    <section className="relative py-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Work</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Some of the noteworthy projects{" "}
            <span className="text-primary">I have built:</span>
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                      : "bg-card/30 border border-border/50 text-muted-foreground hover:bg-card/50 hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid with Images */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => {
            // Handle Sanity image
            let imageUrl: string | undefined;
            
            // Type guard to check if this is a Sanity project with image object
            if (project.image && typeof project.image === 'object' && 'asset' in project.image) {
              try {
                imageUrl = urlFor(project.image)
                  .width(800)
                  .height(400)
                  .url();
              } catch (error) {
                console.error("Error generating image URL:", error);
              }
            } else if (project.image && typeof project.image === 'string') {
              imageUrl = project.image;
            }

            // Determine unique key
            const projectKey = '_id' in project ? project._id : `fallback-${index}`;

            return (
              <div
                key={projectKey}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:bg-card/50 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Project Image with Gradient Fallback */}
                <div className="relative h-48 bg-linear-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Hide image on error, show gradient background
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    // Placeholder with project initial
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl" />
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
          >
            View all projects
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}