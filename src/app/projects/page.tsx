"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";
import { projects as staticProjects } from "@/data/projects";
import { SanityProject } from "@/types/sanity";
import { getCachedData } from "@/lib/sanity-service";

const ALL_ROLES = [
  "All",
  "MLE",
  "Applied Scientist",
  "Data Engineer",
  "Data Science",
  "AI Engineer",
  "Backend SWE",
  "Full-Stack SWE",
  "Analytics Engineer",
];

function toSanityShape(p: (typeof staticProjects)[number]): SanityProject & { headline: string; techStack: string[]; award?: string } {
  return {
    _id: p.id,
    _createdAt: new Date().toISOString(),
    title: p.title,
    slug: { current: p.id },
    description: p.description,
    date: p.date,
    tags: p.tags,
    featured: p.featured,
    coverImage: undefined,
    link: p.link,
    githubUrl: undefined,
    headline: p.headline,
    techStack: p.techStack,
    award: p.award,
  };
}

const projectRoleMap: Record<string, string[]> = {
  dermrx_agent: ["MLE", "Applied Scientist", "AI Engineer", "Full-Stack SWE"],
  ncaa: ["MLE", "Applied Scientist", "Data Science"],
  rag_qa_system: ["MLE", "AI Engineer", "Backend SWE", "Full-Stack SWE"],
  cmi_bfrb: ["MLE", "Applied Scientist", "Data Science"],
  reddit_pipeline: ["Data Engineer", "Backend SWE", "Analytics Engineer"],
  credit_risk: ["Data Science", "Analytics Engineer"],
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [sanityProjects, setSanityProjects] = useState<SanityProject[]>([]);

  useEffect(() => {
    const cached = getCachedData();
    if (cached?.projects && cached.projects.length > 0) {
      setSanityProjects(cached.projects);
    }
  }, []);

  const projectsData = useMemo(() => {
    if (sanityProjects.length > 0) return sanityProjects;
    return staticProjects.map(toSanityShape);
  }, [sanityProjects]);

  const filtered = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        selectedRole === "All" ||
        (projectRoleMap[p._id]?.includes(selectedRole) ?? false);
      return matchesSearch && matchesRole;
    });
  }, [projectsData, searchQuery, selectedRole]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Projects</h1>
        <p className="text-sm text-muted-foreground">
          {staticProjects.length} projects — ranging from Kaggle competitions to production ML systems.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Role filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {ALL_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              selectedRole === role
                ? "bg-foreground text-white border-foreground"
                : "bg-white text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length} of {projectsData.length} projects
      </p>

      {/* Projects list */}
      <div className="space-y-0 divide-y divide-border">
        {filtered.map((project) => {
          const extended = project as typeof project & { headline?: string; techStack?: string[]; award?: string };
          return (
            <div key={project._id} className="py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link
                      href={`/projects/${project.slug.current}`}
                      className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {project.title}
                    </Link>
                    {extended.award && (
                      <span className="text-xs text-[#cc0000] font-medium">
                        {extended.award}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {extended.headline ?? project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(extended.techStack ?? project.tags ?? []).slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {project.date}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground mb-3">No projects match your filters.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedRole("All"); }}
            className="text-xs text-foreground underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
