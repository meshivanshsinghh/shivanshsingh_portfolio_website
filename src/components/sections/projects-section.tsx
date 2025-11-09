import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <section className="container max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <p className="text-muted-foreground mb-12 text-lg">
        A collection of projects I've worked on during my career.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              imageUrl = urlFor(project.image).width(600).height(400).url();
            } catch (error) {
              console.error("Error generating image URL:", error);
            }
          }

          return (
            <Card
              key={"_id" in project ? project._id : index}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-primary/50"
            >
              {/* Project Image */}
              {imageUrl && (
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    {project.date}
                  </span>
                  <div className="flex gap-2">
                    {"githubUrl" in project && project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
