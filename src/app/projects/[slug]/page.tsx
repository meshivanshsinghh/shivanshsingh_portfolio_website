import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  overview,
  date,
  tags,
  technologies,
  features,
  link,
  githubUrl,
  coverImage,
  gallery,
  body,
  featured
}`;

async function getProject(slug: string) {
    const project = await client.fetch(PROJECT_QUERY, { slug });
    return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {

    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <div className="flex gap-3">
                        {project.link && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Live URL
                                </a>
                            </Button>
                        )}
                        {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 border-b border-border/40">
                <div className="container max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        {project.title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6">
                        {project.tags?.map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-sm bg-primary/10 text-primary border-primary/20"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cover Image */}
            {project.coverImage && (
                <section className="py-12 border-b border-border/40">
                    <div className="container max-w-5xl mx-auto px-4">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
                            <Image
                                src={urlFor(project.coverImage).width(1200).height(675).url()}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Overview */}
            {project.overview && (
                <section className="py-16 border-b border-border/40">
                    <div className="container max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">Overview</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {project.overview}
                        </p>
                    </div>
                </section>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
                <section className="py-16 border-b border-border/40">
                    <div className="container max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">Technologies</h2>
                        <ul className="space-y-3">
                            {project.technologies.map((tech: any, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="text-primary">▸</span>
                                    {tech.url ? (
                                        <a
                                            href={tech.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg text-foreground hover:text-primary transition-colors"
                                        >
                                            {tech.name}
                                        </a>
                                    ) : (
                                        <span className="text-lg">{tech.name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
                <section className="py-16 border-b border-border/40">
                    <div className="container max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-6">Features</h2>
                        <ul className="space-y-3">
                            {project.features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-primary mt-1">▸</span>
                                    <span className="text-lg text-muted-foreground flex-1">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
                <section className="py-16 border-b border-border/40">
                    <div className="container max-w-5xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.gallery.map((image: any, index: number) => (
                                <div
                                    key={index}
                                    className="relative aspect-video rounded-xl overflow-hidden border border-border/40"
                                >
                                    <Image
                                        src={urlFor(image).width(800).height(450).url()}
                                        alt={image.alt || `Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {image.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">
                                                {image.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Detailed Content */}
            {project.body && (
                <section className="py-16">
                    <div className="container max-w-4xl mx-auto px-4">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <PortableText value={project.body} />
                        </div>
                    </div>
                </section>
            )}

            {/* Footer CTA */}
            <section className="py-16 border-t border-border/40">
                <div className="container max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-6">Interested in this project?</h3>
                    <div className="flex justify-center gap-4">
                        {project.link && (
                            <Button size="lg" asChild>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Visit Live Site
                                </a>
                            </Button>
                        )}
                        {project.githubUrl && (
                            <Button size="lg" variant="outline" asChild>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    View Source Code
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}