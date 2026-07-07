import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { existsSync } from "fs";
import path from "path";

// Photos auto-appear once dropped into public/about/ (no code change needed).
const PHOTOS: { file: string; caption: string }[] = [
  { file: "lucknow.jpg", caption: "Lucknow" },
  { file: "youtube.jpg", caption: "Backslash Flutter, 2021" },
  { file: "travlog.jpg", caption: "Travlog, 2023–2024" },
  { file: "boston.jpg", caption: "Northeastern, 2025" },
];

const linkClass =
  "font-medium text-foreground underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors";

function CollageTile({ file, caption }: { file: string; caption: string }) {
  const exists = existsSync(path.join(process.cwd(), "public", "about", file));
  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-muted">
        {exists ? (
          <Image
            src={`/about/${file}`}
            alt={caption}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-surface-sunken text-center px-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              photo pending
            </span>
            <code className="text-[10px] font-mono text-accent break-all">public/about/{file}</code>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </Link>

      {/* Intro */}
      <div className="max-w-2xl mb-12">
        <h1 className="text-2xl font-semibold text-foreground mb-6">About</h1>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            I&apos;m from Lucknow. I moved to Boston in 2025 for a Master&apos;s in Analytics at{" "}
            <span className="font-medium text-foreground">Northeastern</span>.
          </p>
          <p>
            Everything I&apos;ve built started with something public. In 2021 I started a YouTube
            channel about Flutter development. It grew to around 13,000 subscribers and just over a
            million views. That channel is how the founders of{" "}
            <Link href="/work/travlog" className={linkClass}>
              Travlog
            </Link>
            , a YC-tracked travel startup, found me. I spent about a year and a half as their
            founding mobile engineer before coming to the US.
          </p>
          <p>
            Now I split my time between the Master&apos;s, tech-leading a research project at the{" "}
            <Link href="/work/fia" className={linkClass}>
              Feminine Intelligence Agency
            </Link>{" "}
            on what LLMs can and can&apos;t do in psychological reasoning tasks, and building the
            tools I want to exist. git-to-doc came out of a hackathon in June and won 1st place at
            GDG Cloud Boston. DermRx came out of Google&apos;s MedGemma Impact Challenge. I compete
            on Kaggle when I have the time for it.
          </p>
          <p>
            The thread running through all of it: I like shipping things and putting them where
            people can see them. Most of the interesting turns in my life have come from doing that.
          </p>
        </div>
      </div>

      {/* Photo collage */}
      <div className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
          The shape of it
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHOTOS.map((p) => (
            <CollageTile key={p.file} file={p.file} caption={p.caption} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 pt-10 border-t border-border flex flex-wrap gap-3">
        <a
          href="mailto:singh.shivan@northeastern.edu"
          className="inline-flex items-center gap-1.5 text-sm border border-foreground rounded px-4 py-2 text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          Send an email
        </a>
        <a
          href="https://linkedin.com/in/shivanshsinghh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Connect on LinkedIn
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          Download CV
        </a>
      </div>
    </div>
  );
}
