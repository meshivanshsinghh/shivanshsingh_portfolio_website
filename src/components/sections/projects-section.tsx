import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, Github, Rocket } from "lucide-react";
import { SanityProject } from "@/types/sanity";
import { projects as fallbackProjects } from "@/data/projects";
import { urlFor } from "@/lib/sanity";

interface ProjectsSectionProps {
  projects?: SanityProject[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const projectsToShow =
    projects && projects.length > 0
      ? projects.slice(0, 3)
      : fallbackProjects.slice(0, 3);

  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Projects</span>
          </div>
          <div className="flex items-end justify-between gap-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Featured <span className="text-primary">Work</span>
            </h2>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground group transition-colors"
            >
              View all projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8">
          {projectsToShow.map((project, index) => {
            const isSanityProject = "_id" in project;
            const hasImage =
              isSanityProject &&
              project.image &&
              typeof project.image === "object" &&
              "asset" in project.image;
            let imageUrl: string | null = null;

            if (hasImage && project.image && typeof project.image === "object") {
              try {
                imageUrl = urlFor(project.image).width(800).height(500).url();
              } catch (error) {
                console.error("Error generating image URL:", error);
              }
            }

            return (
              <div
                key={"_id" in project ? project._id : index}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {imageUrl && (
                    <div className="relative h-64 md:h-full overflow-hidden bg-muted order-2 md:order-1">
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-background/80 via-background/50 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`p-8 md:p-12 flex flex-col justify-center order-1 md:order-2 ${!imageUrl ? 'md:col-span-2' : ''}`}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.slice(0, 5).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground font-medium">
                        {project.date}
                      </span>
                      <div className="flex gap-3">
                        {"githubUrl" in project && project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 md:hidden text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}