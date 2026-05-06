import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects as staticProjects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  headline,
  overview,
  date,
  tags,
  techStack,
  award,
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
  try {
    return await client.fetch(PROJECT_QUERY, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  let coverImageUrl: string | undefined;
  if (project.coverImage?.asset) {
    try {
      coverImageUrl = urlFor(project.coverImage).width(1200).height(630).url();
    } catch {
      coverImageUrl = undefined;
    }
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      ...(coverImageUrl && {
        images: [{ url: coverImageUrl, width: 1200, height: 630, alt: project.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      ...(coverImageUrl && { images: [coverImageUrl] }),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project = await getProject(slug);

  // Fallback to static data
  if (!project) {
    const staticMatch = staticProjects.find((p) => p.id === slug);
    if (!staticMatch) notFound();
    project = {
      _id: staticMatch.id,
      title: staticMatch.title,
      slug: { current: staticMatch.id },
      description: staticMatch.description,
      overview: staticMatch.description,
      date: staticMatch.date,
      tags: staticMatch.tags,
      technologies: staticMatch.techStack.map((t) => ({ name: t })),
      features: [],
      link: staticMatch.link ?? null,
      githubUrl: null,
      coverImage: null,
      gallery: [],
      body: null,
      featured: staticMatch.featured,
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        All projects
      </Link>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-foreground mb-2 leading-snug">
              {project.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {project.description}
            </p>
            {project.date && (
              <p className="text-xs text-muted-foreground mt-3">{project.date}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0 pt-1">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs border border-border rounded px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Live URL
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs border border-border rounded px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Github className="h-3 w-3" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.map((tag: string) => (
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

      {/* Cover Image */}
      {project.coverImage && (
        <div className="relative aspect-video rounded border border-border overflow-hidden mb-10">
          <Image
            src={urlFor(project.coverImage).width(1200).height(675).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Two-column layout for overview + metadata */}
      <div className="grid md:grid-cols-[1fr_220px] gap-12">
        {/* Left: main content */}
        <div className="space-y-10">
          {project.overview && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Overview
              </h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {project.overview}
              </p>
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Key Details
              </h2>
              <ul className="space-y-2">
                {project.features.map((feature: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground">
                    <span className="text-[#cc0000] shrink-0 mt-0.5">·</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Portable Text body */}
          {project.body && (
            <section>
              <div className="prose prose-sm prose-neutral max-w-none text-foreground
                prose-headings:font-semibold prose-headings:text-foreground
                prose-a:text-[#cc0000] prose-a:no-underline hover:prose-a:underline
                prose-code:text-foreground prose-code:bg-secondary prose-code:px-1 prose-code:rounded
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border">
                <PortableText value={project.body} />
              </div>
            </section>
          )}
        </div>

        {/* Right: metadata sidebar */}
        <aside className="space-y-6">
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Technologies
              </h3>
              <ul className="space-y-1.5">
                {project.technologies.map((tech: { name: string; url?: string }, i: number) => (
                  <li key={i} className="text-sm text-foreground">
                    {tech.url ? (
                      <a
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors hover:underline underline-offset-2"
                      >
                        {tech.name}
                      </a>
                    ) : (
                      tech.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-12 pt-10 border-t border-border">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Gallery
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {project.gallery.map((image: { asset?: unknown; alt?: string; caption?: string }, i: number) => (
              <div key={i} className="relative aspect-video rounded border border-border overflow-hidden">
                <Image
                  src={urlFor(image).width(800).height(450).url()}
                  alt={image.alt ?? `Gallery image ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-white/90">
                    <p className="text-xs text-muted-foreground">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      {(project.link || project.githubUrl) && (
        <div className="mt-12 pt-8 border-t border-border flex gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-foreground rounded px-4 py-2 text-foreground hover:bg-foreground hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit Live Site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              View Source
            </a>
          )}
        </div>
      )}
    </div>
  );
}
