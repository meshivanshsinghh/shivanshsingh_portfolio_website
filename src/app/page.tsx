import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Youtube, ArrowRight } from "lucide-react";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { featuredProjects } from "@/data/projects";
import { awards as staticAwards } from "@/data/awards";
import { fetchPortfolioData } from "@/lib/sanity-service";
import { getGitHubStats } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";
import { getLatestVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="w-1 h-3.5 rounded-full bg-[#cc0000] inline-block shrink-0" />
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </h2>
    </div>
  );
}

export default async function Home() {
  const [portfolioData, githubStats, leetcodeStats, youtubeVideos] =
    await Promise.allSettled([
      fetchPortfolioData(),
      getGitHubStats("meshivanshsinghh"),
      getLeetCodeStats("shivanshsinghh"),
      getLatestVideos(3),
    ]).then((results) =>
      results.map((r) => (r.status === "fulfilled" ? r.value : null))
    );

  const data = (portfolioData as Awaited<ReturnType<typeof fetchPortfolioData>>) ?? {
    projects: [],
    blogPosts: [],
    experiences: [],
    educations: [],
    awards: [],
  };

  const blogPosts = data.blogPosts ?? [];
  const awards = data.awards?.length ? data.awards : staticAwards;

  // Top 3 featured projects only
  const projects = (
    data.projects?.filter((p) => p.featured).length
      ? data.projects.filter((p) => p.featured)
      : featuredProjects
  ).slice(0, 3);

  const github = githubStats as Awaited<ReturnType<typeof getGitHubStats>>;
  const leetcode = leetcodeStats as Awaited<ReturnType<typeof getLeetCodeStats>>;
  const videos = (youtubeVideos as Awaited<ReturnType<typeof getLatestVideos>>) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

        {/* Left: sticky profile sidebar */}
        <ProfileSidebar />

        {/* Right: scrollable content */}
        <div className="flex-1 min-w-0 space-y-14">

          {/* ── Bio ─────────────────────────────────── */}
          <section>
            <p className="text-base text-foreground leading-relaxed mb-3">
              Graduate student in Analytics at{" "}
              <span className="font-medium">Northeastern University</span> (GPA 3.96) and software
              engineer with 2+ years of industry experience. I build at the intersection of
              machine learning and production systems - from training pipelines to cloud-deployed
              APIs.
            </p>
            <p className="text-base text-foreground leading-relaxed mb-3">
              Currently serving as Tech Lead at the Feminine Intelligence Agency, leading a
              30-student team evaluating LLMs on psychological reasoning tasks. Previously at{" "}
              <span className="font-medium">Travlog</span>, a YC-tracked startup, where I
              engineered the full cross-platform app and backend from scratch on AWS.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              I compete on Kaggle, contribute to open source, and document what I build on YouTube.
              The channel is shifting toward applied AI and ML engineering.
            </p>
          </section>

          {/* ── Tech Stack ──────────────────────────── */}
          <section>
            <SectionLabel>Tech Stack</SectionLabel>
            <div className="space-y-3">
              <a href="https://skillicons.dev" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://skillicons.dev/icons?i=python,pytorch,tensorflow,fastapi,flask,nodejs,dart,ts,html,css&theme=dark&perline=10"
                  alt="Tech stack: Python, PyTorch, TensorFlow, FastAPI, Flask, Node.js, Dart, TypeScript, HTML, CSS"
                  height={50}
                  className="h-[46px] w-auto"
                />
              </a>
              <a href="https://skillicons.dev" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://skillicons.dev/icons?i=aws,gcp,firebase,docker,linux,git,github,postgres,sqlite,neo4j&theme=dark&perline=10"
                  alt="Tech stack: AWS, GCP, Firebase, Docker, Linux, Git, GitHub, PostgreSQL, SQLite, Neo4j"
                  height={50}
                  className="h-[46px] w-auto"
                />
              </a>
            </div>
          </section>

          {/* ── Selected Projects ───────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 rounded-full bg-[#cc0000] inline-block shrink-0" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Selected Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                All projects
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {projects.map((project) => {
                const id = "_id" in project ? (project as { _id: string })._id : (project as { id: string }).id;
                const headline = project.headline ?? project.description;
                const tech = project.techStack ?? [];
                const projectAward = project.award;
                const link = project.link;
                return (
                  <div
                    key={id}
                    className="py-5 -mx-3 px-3 rounded-lg hover:bg-[#fafafa] transition-colors group/row"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground group-hover/row:text-[#cc0000] transition-colors">
                            {project.title}
                          </h3>
                          {projectAward && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#fff0f0] text-[#cc0000] border border-[#ffcccc] font-medium">
                              {projectAward}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {headline}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tech.slice(0, 5).map((t) => (
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
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${project.title}`}
                            className="text-muted-foreground hover:text-[#cc0000] transition-colors opacity-0 group-hover/row:opacity-100"
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
          </section>

          {/* ── Writing ─────────────────────────────── */}
          {blogPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#cc0000] inline-block shrink-0" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Writing
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                >
                  All posts
                  <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              <div className="divide-y divide-border">
                {blogPosts.slice(0, 3).map((post) => {
                  const slug = typeof post.slug === "object" ? post.slug.current : post.slug;
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
                      className="flex items-start justify-between gap-4 py-4 -mx-3 px-3 rounded-lg hover:bg-[#fafafa] transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-[#cc0000] transition-colors leading-snug">
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

          {/* ── Activity (GitHub + LeetCode) ────────── */}
          {(github || leetcode) && (
            <section>
              <SectionLabel>Activity</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                {github && (
                  <a
                    href="https://github.com/meshivanshsinghh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border rounded-lg p-4 hover:border-[#111] hover:shadow-sm transition-all group"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      GitHub
                    </p>
                    <p className="text-2xl font-bold text-foreground leading-none mb-1">
                      {github.publicRepos}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">public repos</p>
                    <div className="h-px bg-border mb-3" />
                    <p className="text-xs text-muted-foreground">
                      {github.followers} followers
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 group-hover:text-[#cc0000] transition-colors">
                      @meshivanshsinghh ↗
                    </p>
                  </a>
                )}
                {leetcode && (
                  <a
                    href="https://leetcode.com/u/shivanshsinghh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border rounded-lg p-4 hover:border-[#111] hover:shadow-sm transition-all group"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      LeetCode
                    </p>
                    <p className="text-2xl font-bold text-foreground leading-none mb-1">
                      {leetcode.totalSolved}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">problems solved</p>
                    <div className="h-px bg-border mb-3" />
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600 font-medium">{leetcode.easySolved}E</span>
                      <span className="text-yellow-600 font-medium">{leetcode.mediumSolved}M</span>
                      <span className="text-[#cc0000] font-medium">{leetcode.hardSolved}H</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 group-hover:text-[#cc0000] transition-colors">
                      @shivanshsinghh ↗
                    </p>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ── YouTube ─────────────────────────────── */}
          {videos.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#cc0000] inline-block shrink-0" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    YouTube
                  </h2>
                </div>
                <a
                  href="https://youtube.com/@BackslashFlutter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                >
                  View channel
                  <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {videos.map((video) => (
                  <a
                    key={video.videoId}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-border overflow-hidden hover:border-[#111] hover:shadow-sm transition-all"
                  >
                    <div className="relative aspect-video bg-secondary overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                          <Youtube className="h-4 w-4 text-[#cc0000]" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-1.5">
                        {video.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(video.published).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ── Awards & Recognition ────────────────── */}
          {awards.length > 0 && (
            <section>
              <SectionLabel>Awards & Recognition</SectionLabel>
              <div className="divide-y divide-border">
                {awards.map((award) => {
                  const id = "_id" in award ? (award as { _id: string })._id : (award as { id: string }).id;
                  const url = award.url;
                  return (
                    <div
                      key={id}
                      className="py-4 -mx-3 px-3 rounded-lg hover:bg-[#fafafa] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="text-sm font-semibold text-foreground leading-snug">
                              {award.title}
                            </p>
                            {url && (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-[#cc0000] transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {award.org}
                            {"sponsor" in award && award.sponsor
                              ? ` · sponsored by ${award.sponsor}`
                              : ""}
                          </p>
                          {"note" in award && award.note && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {award.note}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                          {award.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── About CTA ───────────────────────────── */}
          <section>
            <Link
              href="/about"
              className="group flex items-center justify-between border border-border rounded-lg p-5 hover:border-[#111] hover:shadow-sm transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-foreground mb-1 group-hover:text-[#cc0000] transition-colors">
                  Work History &amp; Education
                </p>
                <p className="text-xs text-muted-foreground">
                  2 roles · 3 degrees · detailed background
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-[#cc0000] transition-colors shrink-0">
                About
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
