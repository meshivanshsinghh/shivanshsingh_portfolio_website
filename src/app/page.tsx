import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Youtube, Github, Linkedin, Twitter } from "lucide-react";
import ContactForm from "@/components/contact-form";
import TokenHero from "@/components/token-hero";
import ModelCard from "@/components/model-card";
import { featuredProjects } from "@/data/projects";
import { awards as staticAwards } from "@/data/awards";
import { fetchPortfolioData } from "@/lib/sanity-service";
import { urlFor } from "@/lib/sanity";
import { getGitHubStats } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";
import { getLatestVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

function SectionLabel({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <span className="w-1 h-3.5 rounded-full bg-accent inline-block shrink-0" />
      <h2
        className={`text-xs font-semibold uppercase tracking-widest text-muted-foreground ${mono ? "font-mono" : ""
          }`}
      >
        {children}
      </h2>
    </div>
  );
}

export default async function Home() {
  // Artificial delay to ensure the cool tensor loading animation is visible!
  await new Promise(resolve => setTimeout(resolve, 1500));

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

  const projects = (
    data.projects?.filter((p) => p.featured).length
      ? data.projects.filter((p) => p.featured)
      : featuredProjects
  ).slice(0, 3);

  const github = githubStats as Awaited<ReturnType<typeof getGitHubStats>>;
  const leetcode = leetcodeStats as Awaited<ReturnType<typeof getLeetCodeStats>>;
  const videos = (youtubeVideos as Awaited<ReturnType<typeof getLatestVideos>>) ?? [];

  return (
    <>
      {/* ── Hero with tokenizer animation ─────────────────── */}
      <TokenHero />

      {/* ── Model Card (Bio) ─────────────────────────────── */}
      <ModelCard />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">

        {/* Tech Stack */}
        <section>
          <SectionLabel mono>tech_stack</SectionLabel>
          <div className="space-y-6 sm:space-y-8">
            {[
              {
                label: "Languages & Frameworks",
                items: [
                  { id: "python", name: "Python" },
                  { id: "pytorch", name: "PyTorch" },
                  { id: "tensorflow", name: "TensorFlow" },
                  { id: "fastapi", name: "FastAPI" },
                  { id: "flask", name: "Flask" },
                  { id: "nodejs", name: "Node.js" },
                  { id: "dart", name: "Dart" },
                  { id: "ts", name: "TypeScript" },
                  { id: "html", name: "HTML" },
                ]
              },
              {
                label: "Cloud & Infrastructure",
                items: [
                  { id: "aws", name: "AWS" },
                  { id: "gcp", name: "GCP" },
                  { id: "firebase", name: "Firebase" },
                  { id: "docker", name: "Docker" },
                  { id: "linux", name: "Linux" },
                  { id: "git", name: "Git" },
                  { id: "github", name: "GitHub" },
                  { id: "postgres", name: "PostgreSQL" },
                  { id: "sqlite", name: "SQLite" },
                ]
              },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <span className="text-xs text-muted-foreground sm:w-44 shrink-0 font-medium pt-2 sm:pt-3">
                  {row.label}
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4 flex-1">
                  {row.items.map(item => (
                    <div key={item.id} className="flex flex-col items-center gap-1.5 w-[46px] sm:w-[52px] group/icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://skillicons.dev/icons?i=${item.id}`}
                        alt={item.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 group-hover/icon:-translate-y-1 group-hover/icon:scale-110 transition-transform duration-300 shadow-sm rounded-lg"
                      />
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects / Experiments */}
        <section id="experiments">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel mono>experiments</SectionLabel>
            <Link
              href="/projects"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            >
              All projects
              <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const id = "_id" in project
                ? (project as { _id: string })._id
                : (project as { id: string }).id;
              const slug = "slug" in project && project.slug
                ? (typeof project.slug === "object"
                  ? (project.slug as { current: string }).current
                  : project.slug)
                : null;
              const headline = project.headline ?? project.description;
              const projectAward = project.award;
              const link = project.link;

              // Helper for dynamic project images if none is provided in data
              const getProjectImage = (projId: string) => {
                if ("image" in project && typeof project.image === "string") return project.image;
                if (projId === "dermrx_agent") return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"; // Med/Tech
                if (projId === "ncaa") return "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop"; // Basketball
                if (projId === "rag_qa_system") return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"; // AI
                return "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop"; // Generic Code
              };

              return (
                <div
                  key={id}
                  className="group/row rounded-xl border border-border bg-white overflow-hidden hover:border-gray-300 transition-all shadow-sm flex flex-row"
                >
                  {/* Featured Image */}
                  <div className="w-32 sm:w-48 md:w-64 aspect-[16/9] shrink-0 relative border-r border-border bg-secondary overflow-hidden">
                    {/* Fallback image logic using unoptimized next/image for external URLs */}
                    <Image
                      src={getProjectImage(id)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover/row:scale-[1.03] transition-transform duration-500 opacity-90 group-hover/row:opacity-100"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
                    />
                    {/* Add a subtle overlay so it doesn't look too stark */}
                    <div className="absolute inset-0 bg-black/5 group-hover/row:bg-transparent transition-colors pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 min-w-0 w-full flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                        {slug ? (
                          <Link
                            href={`/projects/${slug}`}
                            className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                          >
                            {project.title}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-foreground">
                            {project.title}
                          </span>
                        )}
                        {projectAward && (
                          <span className="text-[10px] font-medium text-[#cc0000] bg-[#fff5f5] border border-[#ffd0d0] px-2 py-0.5 rounded-full whitespace-nowrap">
                            ✦ {projectAward}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                        <span>{project.date}</span>
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${project.title}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-1 sm:mt-0">
                      {headline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Writing */}
        {blogPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionLabel mono>writing</SectionLabel>
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
                const slug = typeof post.slug === "object"
                  ? post.slug.current
                  : post.slug;
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
                    className="flex items-start justify-between gap-4 py-4 group hover:bg-secondary/50 -mx-4 px-4 rounded-lg transition-colors"
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

        {/* Activity / Benchmarks */}
        {(github || leetcode) && (
          <section>
            <SectionLabel mono>benchmarks</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {github && (
                <a
                  href="https://github.com/meshivanshsinghh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border bg-white rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50/50 transition-all shadow-sm group"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    GitHub
                  </p>
                  <p className="text-3xl font-bold text-foreground leading-none mb-1">
                    {github.publicRepos}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">public repos</p>
                  <div className="h-px bg-border mb-3" />
                  <p className="text-xs text-muted-foreground">{github.followers} followers</p>
                  <p className="text-xs text-muted-foreground mt-1.5 group-hover:text-accent transition-colors font-mono">
                    @meshivanshsinghh ↗
                  </p>
                </a>
              )}
              {leetcode && (
                <a
                  href="https://leetcode.com/u/shivanshsinghh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border bg-white rounded-xl p-5 hover:border-gray-300 hover:bg-gray-50/50 transition-all shadow-sm group"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                    LeetCode
                  </p>
                  <p className="text-3xl font-bold text-foreground leading-none mb-1">
                    {leetcode.totalSolved}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">problems solved</p>
                  <div className="h-px bg-border mb-3" />
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="text-emerald-500">{leetcode.easySolved}E</span>
                    <span className="text-amber-500">{leetcode.mediumSolved}M</span>
                    <span className="text-red-500">{leetcode.hardSolved}H</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 group-hover:text-accent transition-colors font-mono">
                    @shivanshsinghh ↗
                  </p>
                </a>
              )}
            </div>
          </section>
        )}

        {/* YouTube */}
        {videos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionLabel mono>youtube</SectionLabel>
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
                  className="group rounded-xl border border-border bg-white overflow-hidden hover:border-gray-300 transition-all shadow-sm flex flex-row sm:flex-col"
                >
                  <div className="relative w-40 sm:w-full shrink-0 aspect-video bg-secondary overflow-hidden border-r sm:border-r-0 sm:border-b border-border">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 160px, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                        <Youtube className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex-1 min-w-0 flex flex-col justify-center">
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

        {/* Awards */}
        {awards.length > 0 && (
          <section>
            <SectionLabel mono>awards</SectionLabel>
            <div className="divide-y divide-border">
              {awards.map((award) => {
                const id = "_id" in award
                  ? (award as { _id: string })._id
                  : (award as { id: string }).id;

                let imageUrl: string | null = null;
                if ("image" in award && award.image?.asset) {
                  try {
                    imageUrl = urlFor(award.image).width(128).height(128).url();
                  } catch { imageUrl = null; }
                }

                const linkLabel = "linkLabel" in award && award.linkLabel
                  ? award.linkLabel
                  : "View";

                return (
                  <div key={id} className="py-5">
                    <div className="flex gap-4">
                      {/* Photo thumbnail */}
                      {imageUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                          <Image
                            src={imageUrl}
                            alt={award.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">
                              {award.title}
                            </p>
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
                            {award.url && (
                              <a
                                href={award.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2 font-medium"
                              >
                                {linkLabel}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                            {award.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* ── Contact section ─────────────────────────────── */}
      <div id="contact" className="bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

            {/* Left: headline + links */}
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#cc0000] mb-4 font-mono">
                  location: Boston, MA
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-white">
                  From notebooks<br />to production.
                </h2>
                <p className="text-sm text-[#999999] leading-relaxed">
                  I build things end-to-end - data pipelines, ML models, APIs, and the frontends
                  that make them useful. Available for full-time roles starting{" "}
                  <span className="text-white font-medium">Dec 2026</span>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#999999] hover:text-white border border-[#333333] hover:border-[#666666] px-4 py-2 rounded-lg transition-colors"
                  >
                    View CV ↗
                  </a>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-[#999999] hover:text-white border border-[#333333] hover:border-[#666666] px-4 py-2 rounded-lg transition-colors"
                  >
                    Full background ↗
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  {[
                    { href: "https://github.com/meshivanshsinghh", icon: Github, label: "GitHub" },
                    { href: "https://linkedin.com/in/shivanshsinghh", icon: Linkedin, label: "LinkedIn" },
                    { href: "https://x.com/shivanshneu", icon: Twitter, label: "Twitter" },
                    { href: "https://youtube.com/@BackslashFlutter", icon: Youtube, label: "YouTube" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-[#999999] hover:text-white transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-5 font-mono">
                get_in_touch
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
