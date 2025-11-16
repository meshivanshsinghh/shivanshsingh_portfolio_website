"use client";

import { Github } from "lucide-react";

interface GitHubContributionsProps {
  username?: string;
}

export default function GitHubContributions({
  username = "meshivanshsinghh",
}: GitHubContributionsProps) {
  return (
    <section className="relative py-20">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Github className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              GitHub Activity
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            My <span className="text-primary">Contribution Graph</span>
          </h2>
        </div>

        {/* GitHub Contribution Graph */}
        <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/39d353/${username}`}
              alt="GitHub Contribution Graph"
              className="w-full h-auto"
              style={{ minWidth: "700px" }}
            />
          </div>
          
          {/* Link to GitHub Profile */}
          <div className="mt-4 text-center">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              View full profile on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
