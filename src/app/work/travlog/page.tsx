import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travlog",
  description: "Software Engineer at Travlog (YC-tracked) - cross-platform social travel app built from scratch on AWS.",
};

const bullets = [
  "Built a modular cross-platform social travel app for collaborative trip planning using Flutter, serving as the sole mobile and infrastructure engineer.",
  "Designed and iterated 15+ SQLite schema versions for an offline-first storage layer that kept the app functional without internet - critical for travel use cases.",
  "Engineered a monolithic backend in Kotlin and Node.js managing 40+ REST endpoints, handling authentication, real-time sync, and content delivery.",
  "Built and maintained a Firebase Cloud Messaging pipeline that processed 500 device tokens within a 256 MB memory constraint.",
  "Migrated the entire stack from a local setup to AWS cloud architecture - provisioning EC2, S3, and RDS - as the user base grew.",
];

const stack = [
  "Flutter", "Dart", "Kotlin", "Node.js", "SQLite",
  "AWS (EC2, S3, RDS)", "Firebase", "REST API", "Git",
];

export default function TravlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to about
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-foreground">Travlog</h1>
          <a
            href="https://travlogapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <p className="text-base font-medium text-foreground mb-4">Software Engineer</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            Jul 2023 - Jan 2025
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Remote - India
          </span>
          <span className="px-2 py-0.5 bg-secondary border border-border rounded text-muted-foreground">
            Full-time
          </span>
          <span className="px-2 py-0.5 bg-[#cc0000]/10 border border-[#cc0000]/30 rounded text-[#cc0000] font-medium">
            YC-tracked startup
          </span>
        </div>
      </div>

      {/* About */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          About
        </h2>
        <p className="text-sm text-foreground leading-relaxed">
          Travlog is a social travel app for collaborative trip planning - think a stripped-down
          Instagram meets a shared itinerary tool. The company was YC-tracked and operating in a
          crowded travel-tech market with a small team. I joined as the sole mobile and
          infrastructure engineer, building the full product from the ground up.
        </p>
      </div>

      {/* What I built */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          What I Built
        </h2>
        <ul className="space-y-4">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground leading-relaxed">
              <span className="text-[#cc0000] font-bold shrink-0 mt-0.5">·</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stack */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 bg-secondary border border-border rounded text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="border-t border-border pt-8 flex items-center justify-between">
        <Link
          href="/about"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to about
        </Link>
        <Link
          href="/work/fia"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Next: FIA →
        </Link>
      </div>
    </div>
  );
}
