import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { featuredProjects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { fetchPortfolioData } from "@/lib/sanity-service";
import { urlFor } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolioData = await fetchPortfolioData();
  const blogPosts = portfolioData.blogPosts ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {/* Left: Profile sidebar */}
        <ProfileSidebar />

        {/* Right: Content */}
        <div className="flex-1 min-w-0 space-y-14">
          {/* Bio */}
          <section>
            <p className="text-base text-foreground leading-relaxed mb-3">
              I&apos;m a software engineer and analytics student at Northeastern University, building at
              the intersection of ML systems and cloud infrastructure. Currently serving as Tech
              Lead at the Feminine Intelligence Agency, where I lead research on LLM-based
              psychological analysis with a 30-student team.
            </p>
            <p className="text-base text-foreground leading-relaxed mb-3">
              Previously at{" "}
              <span className="font-medium">Travlog</span> (YC-tracked startup), where I built a
              cross-platform social travel app from scratch on AWS. I compete on Kaggle and build
              production ML systems — recently a top-20% finish at March Machine Learning Mania
              2026 and a clinical AI agent for Google&apos;s MedGemma Challenge.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              I document what I build on YouTube — 13K subscribers, 1M+ views. The channel is
              evolving toward AI/ML systems and applied research.
            </p>
          </section>

          {/* Featured Projects */}
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Selected Projects
              </h2>
              <Link
                href="/projects"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                All projects <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-0 divide-y divide-border">
              {featuredProjects.map((project) => (
                <div key={project.id} className="py-5 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">
                          {project.title}
                        </h3>
                        {project.award && (
                          <span className="text-xs text-[#cc0000] font-medium">
                            {project.award}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {project.headline}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded"
                          >
                            {tech}
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
              ))}
            </div>
          </section>

          {/* Writing / Blog */}
          {blogPosts.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Writing
                </h2>
                <Link
                  href="/blog"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  All posts <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-0 divide-y divide-border">
                {blogPosts.slice(0, 3).map((post) => {
                  const slug =
                    typeof post.slug === "object" ? post.slug.current : post.slug;
                  const date = post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "";
                  return (
                    <Link
                      key={post._id}
                      href={`/blog/${slug}`}
                      className="flex items-start justify-between gap-4 py-4 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
                          {post.title}
                        </p>
                        {post.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {post.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                        {date}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Experience */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
              Experience
            </h2>
            <div className="space-y-0 divide-y divide-border">
              {experiences.map((exp, i) => (
                <div key={i} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {exp.role}
                        <span className="font-normal text-muted-foreground">
                          {" "}· {exp.company}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {exp.location}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                      {exp.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
              Education
            </h2>
            <div className="space-y-0 divide-y divide-border">
              {education.map((edu, i) => (
                <div key={i} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {edu.school}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {edu.degree}, {edu.field}
                        {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                      {edu.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
