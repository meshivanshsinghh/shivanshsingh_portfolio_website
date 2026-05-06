import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Youtube, Github, Linkedin, Twitter } from "lucide-react";
import ContactForm from "@/components/contact-form";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { featuredProjects } from "@/data/projects";
import { awards as staticAwards } from "@/data/awards";
import { fetchPortfolioData } from "@/lib/sanity-service";
import { urlFor } from "@/lib/sanity";
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
      {/* ── Main two-column layout ─────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

          <ProfileSidebar />

          <div className="flex-1 min-w-0 space-y-14">

            {/* Bio */}
            <section>
              <p className="text-base text-foreground leading-relaxed mb-3">
                Graduate student in <strong>Analytics at Northeastern University</strong> (GPA
                3.96) and software engineer with 2+ years of industry experience. I build at the
                intersection of <em>machine learning and production systems</em> - from training
                pipelines to cloud-deployed APIs.
              </p>
              <p className="text-base text-foreground leading-relaxed mb-3">
                Currently <strong>Tech Lead at the{" "}
                <Link href="/work/fia" className="underline underline-offset-2 decoration-[#cc0000]/40 hover:decoration-[#cc0000] transition-colors">
                  Feminine Intelligence Agency
                </Link></strong>, leading a 30-student team evaluating LLMs on psychological
                reasoning tasks. Previously at{" "}
                <Link href="/work/travlog" className="font-semibold underline underline-offset-2 decoration-[#cc0000]/40 hover:decoration-[#cc0000] transition-colors">
                  Travlog
                </Link>, a YC-tracked startup, where I engineered the full cross-platform app
                and backend <em>from scratch</em> on AWS.
              </p>
              <p className="text-base text-foreground leading-relaxed">
                I compete on Kaggle, contribute to open source, and document what I build on
                YouTube. The channel is shifting toward <em>applied AI and ML engineering</em>.
              </p>
            </section>

            {/* Tech Stack */}
            <section>
              <SectionLabel>Tech Stack</SectionLabel>
              <div className="space-y-4">
                {[
                  {
                    label: "Languages & Frameworks",
                    icons: "python,pytorch,tensorflow,fastapi,flask,nodejs,dart,ts,html,css",
                    alt: "Python, PyTorch, TensorFlow, FastAPI, Flask, Node.js, Dart, TypeScript, HTML, CSS",
                  },
                  {
                    label: "Cloud & Infrastructure",
                    icons: "aws,gcp,firebase,docker,linux,git,github,postgres,sqlite,neo4j",
                    alt: "AWS, GCP, Firebase, Docker, Linux, Git, GitHub, PostgreSQL, SQLite, Neo4j",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs text-muted-foreground sm:w-44 shrink-0 font-medium">
                      {row.label}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://skillicons.dev/icons?i=${row.icons}&theme=light&perline=10`}
                      alt={row.alt}
                      className="h-[40px] w-auto"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Projects */}
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

                  return (
                    <div key={id} className="py-5 group/row">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          {slug ? (
                            <Link
                              href={`/projects/${slug}`}
                              className="text-sm font-semibold text-foreground hover:text-[#cc0000] transition-colors"
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
                              {projectAward}
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
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {headline}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Writing */}
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
                        className="flex items-start justify-between gap-4 py-4 group"
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

            {/* Activity */}
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
                      <p className="text-xs text-muted-foreground">{github.followers} followers</p>
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

            {/* YouTube */}
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

            {/* Awards */}
            {awards.length > 0 && (
              <section>
                <SectionLabel>Awards & Recognition</SectionLabel>
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
                                    className="inline-flex items-center gap-1 text-xs text-[#cc0000] hover:underline mt-2 font-medium"
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
        </div>
      </div>

      {/* ── Closing statement ─────────────────────────────────
          Full-width dark section — sits above the regular footer.
          Breaks out of the white layout intentionally.
      ────────────────────────────────────────────────────── */}
      <div
        className="bg-[#0f0f0f] text-white"
        style={{
          backgroundImage: "radial-gradient(circle, #2a2a2a 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

            {/* Left: headline + links */}
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#cc0000] mb-4">
                  Based in Boston, MA
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-white">
                  From notebooks<br /> to production.
                </h2>
                <p className="text-sm text-[#999] leading-relaxed">
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
                    className="text-sm font-medium text-[#aaa] hover:text-white border border-[#333] hover:border-[#555] px-4 py-2 rounded-lg transition-colors"
                  >
                    View CV ↗
                  </a>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-[#aaa] hover:text-white border border-[#333] hover:border-[#555] px-4 py-2 rounded-lg transition-colors"
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
                      className="text-[#555] hover:text-white transition-colors"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-5">
                Get in touch
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
