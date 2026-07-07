import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects as staticProjects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// These projects are still being written up. git-to-doc is the one shipped
// writeup and lives at its own /git-to-doc route, so every /projects/[slug]
// currently resolves to a "coming soon" state. Gate on a flag later if a
// full writeup lands.
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
  date,
  tags,
  link
}`;

type ResolvedProject = {
  title: string;
  description: string;
  date?: string;
  tags?: string[];
  link?: string | null;
};

async function getProject(slug: string): Promise<ResolvedProject | null> {
  try {
    const fromSanity = await client.fetch<ResolvedProject | null>(PROJECT_QUERY, { slug });
    if (fromSanity?.title) return fromSanity;
  } catch {
    // fall through to static data
  }
  const staticMatch = staticProjects.find((p) => p.id === slug);
  if (!staticMatch) return null;
  return {
    title: staticMatch.title,
    description: staticMatch.description,
    date: staticMatch.date,
    tags: staticMatch.tags,
    link: staticMatch.link ?? null,
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: project.title, description: "Writeup coming soon." };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-14 md:py-20">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-3 w-3" />
        All projects
      </Link>

      {/* Header */}
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent border border-accent/30 bg-accent/10 rounded px-2 py-1 mb-5">
        Writeup in progress
      </span>
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-snug">
        {project.title}
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{project.description}</p>

      {/* Terminal note */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm font-mono text-sm">
        <p className="text-muted-foreground">
          <span className="text-accent">$</span> cat writeup.md
        </p>
        <p className="text-foreground mt-2">
          &gt; writeup in progress
          <span className="inline-block w-[2px] h-[1em] bg-foreground ml-1 align-middle animate-cursor-blink" />
        </p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mt-6">
        I&apos;m still writing this one up. Check back soon.
      </p>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-8">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View live
          </a>
        )}
        <Link
          href="/git-to-doc"
          className="inline-flex items-center gap-1.5 text-sm border border-foreground rounded px-4 py-2 text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          See git-to-doc, shipped &rarr;
        </Link>
      </div>

      {/* Nav */}
      <div className="border-t border-border mt-12 pt-8">
        <Link
          href="/projects"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to all projects
        </Link>
      </div>
    </div>
  );
}
