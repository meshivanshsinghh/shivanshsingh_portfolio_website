import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowLeft, Github, ExternalLink, Package, Trophy, BookOpen } from "lucide-react";
import CopyCommand from "@/components/git-to-doc/copy-command";
import VerifyTerminal from "@/components/git-to-doc/verify-terminal";

// ─────────────────────────────────────────────────────────────────
// LINKS & COPY
// ─────────────────────────────────────────────────────────────────

const PYPI_URL = "https://pypi.org/project/git-to-doc/";
const GITHUB_URL = "https://github.com/meshivanshsinghh/git-to-doc";
const README_URL = "https://github.com/meshivanshsinghh/git-to-doc#readme";
const BENCHMARKS_URL = "https://github.com/meshivanshsinghh/git-to-doc/blob/main/BENCHMARKS.md";

const PITCH = "The audit layer for AI-generated commits";

const INTRO =
  "git-to-doc reads a code diff and checks whether the commit message actually describes the change. Two auditor models from different families read the diff on their own, before either one sees the message. Anything the message leaves out or gets wrong becomes a divergence, and each one points to a file and line.";

const HOW_IT_WORKS: { title: string; body: string }[] = [
  {
    title: "Two auditors from different families",
    body: "Default pair: qwen2.5-coder:14b and deepseek-coder-v2. Different training data gives them different blind spots, so they rarely fail in the same way.",
  },
  {
    title: "Each reads the diff blind",
    body: "Both models describe what the diff does before either one sees the author's commit message.",
  },
  {
    title: "Compare against the message",
    body: "Each independent reading is checked against the actual commit message. Anything it leaves out or gets wrong becomes a divergence.",
  },
  {
    title: "Cite a line, or get rejected",
    body: "Every divergence must reference a file and a line number. If a model can't produce a valid citation, Pydantic schema validation drops the output.",
  },
  {
    title: "Confidence by agreement",
    body: "HIGH = both models flagged the same file:line, within three lines. possible = only one auditor flagged it.",
  },
  {
    title: "Errors out when unsure",
    body: "If neither auditor can produce a valid cited report, the tool errors out. It won't invent an “all clear.”",
  },
];

const PIPELINE = `[ diff ]
   │
   ├─▶ qwen2.5-coder:14b     reads blind
   └─▶ deepseek-coder-v2     reads blind
   │
   ▼
compare each reading against the commit message
   │
   ▼
divergences, each citing file:line
   HIGH = both models agree  ·  possible = one model`;

const SYNTHETIC: { value: string; label: string }[] = [
  { value: "69%", label: "Precision" },
  { value: "36%", label: "Recall" },
  { value: "32%", label: "False-positive rate" },
];

const REAL_WORLD: { value: string; label: string }[] = [
  { value: "29%", label: "Divergence rate" },
  { value: "11%", label: "Inter-auditor agreement" },
  { value: "50", label: "HIGH-confidence findings" },
];

const PER_TOOL: { tool: string; rate: number }[] = [
  { tool: "Cursor", rate: 45 },
  { tool: "Copilot", rate: 20 },
  { tool: "Claude", rate: 19 },
];

const LIMITATIONS: string[] = [
  "On dense diffs, the tool over-flags. When I hand-checked the top HIGH findings, about 30% were real omissions. The other 70% were the auditors over-reading complex code where the message was actually fine.",
  "Recall is low on purpose. HIGH only fires when both models agree, which is a strict bar. That's why synthetic recall sits at 36%.",
  "Real-world inter-auditor agreement is 11%. Most findings show up as single-auditor “possible” flags for a human to review.",
];

const STORY: string[] = [
  "This didn't start as an auditor. It won 1st place at the GDG Cloud Boston hackathon as a commit message generator, which is a saturated space.",
  "Mid-build I realized the more interesting problem: in 2026 most commits are written by AI, the person merging them often doesn't know exactly what changed, and the “reviewer” is often the same model family that wrote the code.",
  "So I rewrote the tool to audit instead of generate. Then benchmarked it, hand-checked the results, and shipped it honestly.",
];

// ─────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "git-to-doc",
  description:
    "An audit layer for AI-generated commits. Two different-family models read a diff independently and flag where the commit message doesn't match the code. 1st place, GDG Cloud Boston × Northeastern.",
  openGraph: {
    title: "git-to-doc | Shivansh Singh",
    description:
      "An audit layer for AI-generated commits. Two different-family models read a diff independently and flag where the commit message doesn't match the code.",
    type: "website",
    url: "https://shivanshsingh.in/git-to-doc",
    images: ["/git-to-doc/main_banner.jpg"],
  },
  robots: { index: true, follow: true },
};

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
      {children}
    </h2>
  );
}

function MetricGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((m) => (
        <div key={m.label} className="border border-border rounded-lg p-4 bg-secondary/50">
          <div className="text-xl font-semibold text-foreground mb-1 font-mono tabular-nums">
            {m.value}
          </div>
          <div className="text-xs text-muted-foreground leading-snug">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

// In-content photo: subtle rounded corners, lazy-loaded, capped at ~720px on screen.
function Photo({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-lg border border-border shadow-sm bg-muted">
        <Image
          src={src}
          alt={alt}
          width={1500}
          height={1000}
          quality={90}
          sizes="(max-width: 768px) 100vw, 720px"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="text-xs text-muted-foreground mt-2.5">{caption}</figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────

export default function GitToDocPage() {
  return (
    <div>
      {/* ── HERO BAND (full-bleed venue photo behind everything) ── */}
      <section className="relative isolate overflow-hidden border-b border-border">
        {/* Dark base under the photo keeps the title/chips legible even before the image decodes */}
        <div className="absolute inset-0 -z-10 bg-neutral-900">
          <Image
            src="/git-to-doc/main_banner.jpg"
            alt="On stage at the GDG Cloud Boston × Northeastern hackathon"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-14 md:pt-10 md:pb-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to projects
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white font-mono mb-3">git-to-doc</h1>
          <p className="text-base md:text-lg font-medium text-white/90 mb-5">{PITCH}</p>

          <div className="flex flex-wrap gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent border border-accent rounded text-white font-medium">
              <Trophy className="h-3 w-3" />
              1st place &middot; GDG Cloud Boston &times; Northeastern
            </span>
            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white/80 backdrop-blur-sm">
              Powered by Gemma
            </span>
            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white/80 backdrop-blur-sm">
              June 2026
            </span>
            <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white/80 backdrop-blur-sm">
              Open source
            </span>
          </div>

          <div className="mt-6 max-w-md">
            <CopyCommand command="pip install git-to-doc" />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={PYPI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/85 border border-white/25 hover:border-white/50 px-2.5 py-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              <Package className="h-3 w-3" />
              PyPI
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/85 border border-white/25 hover:border-white/50 px-2.5 py-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              <Github className="h-3 w-3" />
              GitHub
            </a>
            <a
              href={README_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/85 border border-white/25 hover:border-white/50 px-2.5 py-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              <BookOpen className="h-3 w-3" />
              README
            </a>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* What it is */}
        <div className="mb-12">
          <SectionLabel>What it is</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed">{INTRO}</p>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <SectionLabel>How it works</SectionLabel>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 mb-6 overflow-x-auto shadow-sm">
            <pre className="text-[11px] sm:text-xs font-mono text-muted-foreground leading-relaxed whitespace-pre">
              {PIPELINE}
            </pre>
          </div>

          <ol className="space-y-4">
            {HOW_IT_WORKS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="text-[11px] font-mono text-accent shrink-0 mt-0.5 w-5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* See it run */}
        <div className="mb-12">
          <SectionLabel>See it run</SectionLabel>

          <Photo
            src="/git-to-doc/me_showing_demo.jpg"
            alt="Demoing git-to-doc to a judge at the hackathon"
            caption="Demoing git-to-doc to a judge at the hackathon, June 2026."
          />

          {/* Real terminal output sits below the photo */}
          <div className="mt-6">
            <VerifyTerminal />
          </div>
        </div>

        {/* Benchmarks */}
        <div className="mb-12">
          <SectionLabel>Benchmarks</SectionLabel>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Full methodology and raw results are in{" "}
            <a
              href={BENCHMARKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors"
            >
              BENCHMARKS.md
            </a>
            .
          </p>

          <div className="space-y-7">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-3">
                Synthetic &middot; n=168 &middot; ground truth known
              </p>
              <MetricGrid items={SYNTHETIC} />
            </div>

            <div>
              <p className="text-xs font-mono text-muted-foreground mb-3">
                Real-world &middot; n=95 &middot; actual AI-authored commits
              </p>
              <MetricGrid items={REAL_WORLD} />
            </div>

            <div>
              <p className="text-xs font-mono text-muted-foreground mb-3">
                Divergence rate by authoring tool
              </p>
              <div className="space-y-2.5">
                {PER_TOOL.map((t) => (
                  <div key={t.tool} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-foreground w-16 shrink-0">{t.tool}</span>
                    <div className="flex-1 h-[7px] bg-code-bg rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-[2px]"
                        style={{ width: `${t.rate}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-9 text-right tabular-nums">
                      {t.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mt-6 pt-4 border-t border-border">
            Scope: one hardware tier (16GB RAM), one model pair. Only the default pair is
            benchmarked. Other pairs are open questions.
          </p>
        </div>

        {/* Honest limitations */}
        <div className="mb-12">
          <SectionLabel>Honest limitations</SectionLabel>
          <div className="rounded-lg border border-border bg-secondary/30 p-5">
            <ul className="space-y-4">
              {LIMITATIONS.map((l, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-accent font-bold shrink-0 mt-0.5">&middot;</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How it got here */}
        <div className="mb-12">
          <SectionLabel>How it got here</SectionLabel>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mb-6">
            {STORY.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Photo
            src="/git-to-doc/winner.jpg"
            alt="Accepting first place at the hackathon"
            caption="Accepting first place at the Powered by Gemma hackathon, June 2026."
          />
        </div>

        {/* Footer nav */}
        <div className="border-t border-border pt-8 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to projects
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
