import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import { SanityProject } from "@/types/sanity";
import { projects as fallbackProjects } from "@/data/projects";

interface ProjectsSectionProps {
  projects?: SanityProject[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Use Sanity data if available, otherwise use fallback
  const projectsToShow = projects && projects.length > 0 
    ? projects.slice(0, 2)
    : fallbackProjects.slice(0, 2);

  return (
    <section className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Link
          href="/projects"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="text-muted-foreground mb-8">
        A collection of open source and private projects I've worked on during my career.
      </p>

      <div className="space-y-4">
        {projectsToShow.map((project, index) => (
          <Card key={'_id' in project ? project._id : index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{project.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}