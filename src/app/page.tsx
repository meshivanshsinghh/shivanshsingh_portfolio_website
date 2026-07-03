import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Youtube, Github, Linkedin, Twitter } from "lucide-react";
import ContactForm from "@/components/contact-form";
import TokenHero from "@/components/token-hero";
import ModelCard from "@/components/model-card";
import AwardsCarousel from "@/components/awards-carousel";
import { featuredProjects } from "@/data/projects";
import { awards as staticAwards } from "@/data/awards";
import { fetchPortfolioData } from "@/lib/sanity-service";
import { urlFor } from "@/lib/sanity";
import { getGitHubStats } from "@/lib/github";
import { getLeetCodeStats } from "@/lib/leetcode";
import { getLatestVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────
// SHARED
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <span className="w-1 h-3.5 rounded-full bg-accent inline-block shrink-0" />
      <h2 className={`text-xs font-semibold uppercase tracking-widest text-muted-foreground ${mono ? "font-mono" : ""}`}>
        {children}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DONUT CHART (LeetCode-style)
// ─────────────────────────────────────────────────────────────────

function LeetCodeDonut({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const total = easy + medium + hard;
  if (total === 0) return null;

  const r = 36;
  const C = 2 * Math.PI * r;

  const easyLen = (easy / total) * C;
  const medLen = (medium / total) * C;
  const hardLen = (hard / total) * C;

  return (
    <div className="flex items-center gap-6 sm:gap-8">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="rotate(-90 50 50)">
            {/* Background track */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--code-bg)" strokeWidth="7" />
            {/* Easy — green */}
            {easyLen > 0 && (
              <circle cx="50" cy="50" r={r} fill="none"
                stroke="#00b8a3" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${easyLen} ${C - easyLen}`}
                strokeDashoffset="0"
              />
            )}
            {/* Medium — yellow */}
            {medLen > 0 && (
              <circle cx="50" cy="50" r={r} fill="none"
                stroke="#ffc01e" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${medLen} ${C - medLen}`}
                strokeDashoffset={easyLen}
              />
            )}
            {/* Hard — red */}
            {hardLen > 0 && (
              <circle cx="50" cy="50" r={r} fill="none"
                stroke="#ef4743" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${hardLen} ${C - hardLen}`}
                strokeDashoffset={easyLen + medLen}
              />
            )}
          </g>
          {/* Center text */}
          <text x="50" y="46" textAnchor="middle" dominantBaseline="central"
            className="text-xl font-bold" fill="currentColor"
          >
            {total}
          </text>
          <text x="50" y="62" textAnchor="middle" className="text-[7px]" fill="#9ca3af">
            solved
          </text>
        </svg>
      </div>

      {/* Difficulty labels */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#00b8a3]" />
          <span className="text-muted-foreground font-mono text-xs w-10">Easy</span>
          <span className="font-semibold text-foreground font-mono">{easy}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#ffc01e]" />
          <span className="text-muted-foreground font-mono text-xs w-10">Med.</span>
          <span className="font-semibold text-foreground font-mono">{medium}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4743]" />
          <span className="text-muted-foreground font-mono text-xs w-10">Hard</span>
          <span className="font-semibold text-foreground font-mono">{hard}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TECH STACK DATA
// ─────────────────────────────────────────────────────────────────

const TECH_STACK = [
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
      { id: "react", name: "React" },
      { id: "html", name: "HTML", mobileOnly: true },
    ],
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
      { id: "redis", name: "Redis" },
      { id: "sqlite", name: "SQLite", mobileOnly: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────

export default async function Home() {
  // Brief delay so the preloader animation plays
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
    projects: [], blogPosts: [], experiences: [], educations: [], awards: [],
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

  // Preprocess awards for carousel
  const carouselAwards = awards.map((award) => {
    const id = "_id" in award ? (award as { _id: string })._id : (award as { id: string }).id;
    let imageUrl: string | null = null;
    if ("image" in award && award.image?.asset) {
      try { imageUrl = urlFor(award.image).width(128).height(128).url(); }
      catch { imageUrl = null; }
    }
    return {
      id,
      title: award.title,
      org: award.org,
      date: award.date,
      url: award.url || null,
      imageUrl,
      sponsor: "sponsor" in award && award.sponsor ? (award.sponsor as string) : null,
      note: "note" in award && award.note ? (award.note as string) : null,
      linkLabel: "linkLabel" in award && award.linkLabel ? (award.linkLabel as string) : "View",
    };
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <TokenHero />

      {/* ── Model Card ───────────────────────────────────── */}
      <ModelCard />

      {/* ── Content sections ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">

        {/* ── 1. Capabilities ────────────────────────────── */}
        {(github || leetcode) && (
          <section>
            <SectionLabel mono>capabilities</SectionLabel>
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground ml-2">eval_report.log</span>
              </div>

              <div className="p-5 sm:p-6 md:p-8 space-y-5">
                <p className="text-[11px] font-mono text-muted-foreground">
                  &gt; running eval_suite --profile shivansh-v2026
                </p>

                {/* GitHub row */}
                {github && (
                  <a href="https://github.com/meshivanshsinghh" target="_blank" rel="noopener noreferrer"
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 group hover:bg-secondary/30 -mx-3 px-3 rounded-lg transition-colors"
                  >
                    <span className="text-green-600 text-sm font-mono">✓</span>
                    <Github className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    <span className="text-[11px] font-mono text-muted-foreground w-28 sm:w-36 shrink-0">github.activity</span>
                    <span className="text-sm font-medium text-foreground font-mono">{github.publicRepos} repos</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-sm text-foreground font-mono">{github.followers} followers</span>
                    <span className="ml-auto shrink-0 flex items-center gap-1.5">
                      <span className="text-green-600 text-[10px] font-mono font-semibold hidden sm:inline">PASS</span>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </span>
                  </a>
                )}

                {/* LeetCode row */}
                {leetcode && (
                  <a href="https://leetcode.com/u/shivanshsinghh" target="_blank" rel="noopener noreferrer"
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 group hover:bg-secondary/30 -mx-3 px-3 rounded-lg transition-colors"
                  >
                    <span className="text-green-600 text-sm font-mono">✓</span>
                    {/* LeetCode icon (no lucide icon, use inline SVG) */}
                    <svg className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                    </svg>
                    <span className="text-[11px] font-mono text-muted-foreground w-28 sm:w-36 shrink-0">leetcode.solved</span>
                    <span className="text-sm font-medium text-foreground font-mono">{leetcode.totalSolved} total</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      (<span className="text-emerald-600">{leetcode.easySolved}E</span>{" "}
                      <span className="text-amber-600">{leetcode.mediumSolved}M</span>{" "}
                      <span className="text-red-600">{leetcode.hardSolved}H</span>)
                    </span>
                    {/* Streak dots + text */}
                    {leetcode.last7DaysMap && (
                      <span className="hidden sm:flex items-center gap-1.5 ml-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{leetcode.streak}d streak</span>
                        <span className="flex items-center gap-[3px]">
                          {leetcode.last7DaysMap.map((active, i) => (
                            <span
                              key={i}
                              className={`w-[6px] h-[6px] rounded-full ${
                                active ? "bg-emerald-500" : "bg-border"
                              }`}
                            />
                          ))}
                        </span>
                      </span>
                    )}
                    <span className="ml-auto shrink-0 flex items-center gap-1.5">
                      <span className="text-green-600 text-[10px] font-mono font-semibold hidden sm:inline">PASS</span>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </span>
                  </a>
                )}

                {/* LeetCode donut chart + problem distribution */}
                {leetcode && (
                  <div className="border-t border-border pt-5 mt-2">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                      {/* Donut */}
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                          Difficulty Breakdown
                        </p>
                        <LeetCodeDonut
                          easy={leetcode.easySolved}
                          medium={leetcode.mediumSolved}
                          hard={leetcode.hardSolved}
                        />
                      </div>

                      {/* Problem distribution bars */}
                      {leetcode.topTags && leetcode.topTags.length > 0 && (
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                            Problem Distribution
                          </p>
                          <div className="space-y-2.5">
                            {leetcode.topTags.slice(0, 6).map((tag) => {
                              const maxCount = leetcode.topTags[0].problemsSolved;
                              const pct = Math.round((tag.problemsSolved / maxCount) * 100);
                              return (
                                <div key={tag.tagName} className="flex items-center gap-3 text-xs">
                                  <span className="w-24 sm:w-28 text-muted-foreground font-mono text-[11px] truncate shrink-0">
                                    {tag.tagName}
                                  </span>
                                  <div className="flex-1 h-2 rounded-full bg-code-bg overflow-hidden max-w-[200px]">
                                    <div className="h-full rounded-full bg-accent/60" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-foreground font-medium font-mono w-6 text-right text-[11px]">
                                    {tag.problemsSolved}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {leetcode && leetcode.recentSubmissions && leetcode.recentSubmissions.length > 0 && (
                  <div className="border-t border-border pt-5 mt-2">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                      Recent Activity
                    </p>
                    <div className="space-y-0">
                      {leetcode.recentSubmissions.map((sub, i) => {
                        const date = new Date(sub.timestamp * 1000);
                        const month = date.toLocaleString("en-US", { month: "short" });
                        const day = String(date.getDate()).padStart(2, "0");
                        return (
                          <a
                            key={`${sub.titleSlug}-${i}`}
                            href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-x-3 py-2 group hover:bg-secondary/30 -mx-3 px-3 rounded-lg transition-colors"
                          >
                            <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                              [{month} {day}]
                            </span>
                            <span className="text-green-600 text-sm font-mono">✓</span>
                            <span className="text-sm font-mono text-foreground truncate flex-1 min-w-0 group-hover:text-white transition-colors">
                              {sub.title}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600/70 shrink-0 hidden sm:inline">
                              accepted
                            </span>
                            <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="border-t border-border pt-5 mt-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                    Verified Stack
                  </p>
                  <div className="space-y-6 sm:space-y-8">
                    {TECH_STACK.map((row) => (
                      <div key={row.label} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <span className="text-xs text-muted-foreground sm:w-44 shrink-0 font-medium pt-2 sm:pt-3">
                          {row.label}
                        </span>
                        <div className="flex flex-wrap gap-3 sm:gap-4 flex-1">
                          {row.items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex flex-col items-center gap-1.5 w-[46px] sm:w-[52px] group/icon ${
                                "mobileOnly" in item && item.mobileOnly ? "md:hidden" : ""
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://skillicons.dev/icons?i=${item.id}`}
                                alt={item.name}
                                className="w-9 h-9 sm:w-10 sm:h-10 group-hover/icon:-translate-y-1 group-hover/icon:scale-110 transition-transform duration-300 shadow-sm rounded-lg"
                              />
                              <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center leading-tight">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border pt-3 mt-2">
                  <p className="text-[10px] font-mono text-green-600">
                    eval complete · 0 failures · 0 warnings
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 2. Projects ────────────────────────────────── */}
        <section id="experiments">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel mono>experiments</SectionLabel>
            <Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
              All projects
              <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const id = "_id" in project ? (project as { _id: string })._id : (project as { id: string }).id;
              const slug = "slug" in project && project.slug
                ? (typeof project.slug === "object" ? (project.slug as { current: string }).current : project.slug)
                : null;
              const headline = project.headline ?? project.description;
              const projectAward = project.award;
              const link = project.link;

              const getProjectImage = (projId: string) => {
                if ("image" in project && typeof project.image === "string") return project.image;
                if (projId === "dermrx_agent") return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop";
                if (projId === "ncaa") return "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop";
                if (projId === "rag_qa_system") return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
                return "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop";
              };

              return (
                <div key={id} className="group/row rounded-xl border border-border bg-card overflow-hidden hover:border-ring transition-all shadow-sm flex flex-row">
                  <div className="w-32 sm:w-48 md:w-64 aspect-[16/9] shrink-0 relative border-r border-border bg-secondary overflow-hidden">
                    <Image src={getProjectImage(id)} alt={project.title} fill
                      className="object-cover group-hover/row:scale-[1.03] transition-transform duration-500 opacity-90 group-hover/row:opacity-100"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover/row:bg-transparent transition-colors pointer-events-none" />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 min-w-0 w-full flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                        {slug ? (
                          <Link href={`/projects/${slug}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                            {project.title}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-foreground">{project.title}</span>
                        )}
                        {projectAward && (
                          <span className="text-[10px] font-medium text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                            ✦ {projectAward}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                        <span>{project.date}</span>
                        {link && (
                          <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-1 sm:mt-0">{headline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. Writing ─────────────────────────────────── */}
        {blogPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionLabel mono>writing</SectionLabel>
              <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                All posts
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {blogPosts.slice(0, 3).map((post) => {
                const slug = typeof post.slug === "object" ? post.slug.current : post.slug;
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "";
                return (
                  <Link key={post._id} href={`/blog/${slug}`}
                    className="flex items-start justify-between gap-4 py-4 group hover:bg-secondary/50 -mx-4 px-4 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">{post.title}</p>
                      {post.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{post.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">{date}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 4. YouTube ──────────────────────────────────── */}
        {videos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionLabel mono>youtube</SectionLabel>
              <a href="https://youtube.com/@BackslashFlutter" target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                View channel
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {videos.map((video) => (
                <a key={video.videoId} href={video.url} target="_blank" rel="noopener noreferrer"
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-ring transition-all shadow-sm flex flex-row sm:flex-col"
                >
                  <div className="relative w-40 sm:w-full shrink-0 aspect-video bg-secondary overflow-hidden border-r sm:border-r-0 sm:border-b border-border">
                    <Image src={video.thumbnail} alt={video.title} fill
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
                    <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-1.5">{video.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(video.published).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. Awards (Carousel) ────────────────────────── */}
        {awards.length > 0 && (
          <section>
            <SectionLabel mono>awards</SectionLabel>
            <AwardsCarousel awards={carouselAwards} />
          </section>
        )}
      </div>

      {/* ── Contact ───────────────────────────────────────── */}
      <div className="dark">
        <div id="contact" className="bg-surface-sunken border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 font-mono">
                  location: Boston, MA
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-foreground">
                  From notebooks<br />to production.
                </h2>
                <p className="text-sm text-text-dim leading-relaxed">
                  I build things end-to-end - data pipelines, ML models, APIs, and the frontends
                  that make them useful. Available for full-time roles starting{" "}
                  <span className="text-foreground font-medium">Dec 2026</span>.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-text-dim hover:text-foreground border border-border hover:border-muted-foreground px-4 py-2 rounded-lg transition-colors"
                  >
                    View CV ↗
                  </a>
                  <Link href="/about"
                    className="text-sm font-medium text-text-dim hover:text-foreground border border-border hover:border-muted-foreground px-4 py-2 rounded-lg transition-colors"
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
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="text-text-dim hover:text-foreground transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-dim mb-5 font-mono">get_in_touch</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
