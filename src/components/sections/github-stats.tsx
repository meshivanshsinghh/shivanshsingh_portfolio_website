"use client";

import { useEffect, useState } from "react";
import { Github, GitFork, Star, GitPullRequest } from "lucide-react";

interface GitHubStatsProps {
  username?: string;
}

interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
  total_stars?: number;
  total_forks?: number;
}

export default function GitHubStats({
  username = "meshivanshsinghh",
}: GitHubStatsProps) {
  const [stats, setStats] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, [username]);

  return (
    <section className="py-20">
      <div className="container max-w-5xl mx-auto px-8 sm:px-6 md:px-4">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Github className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              GitHub Activity
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Open Source <span className="text-primary">Contributions</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                <Github className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : stats?.public_repos || 0}
              </div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
          </div>

          <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : "50+"}
              </div>
              <div className="text-sm text-muted-foreground">Stars Earned</div>
            </div>
          </div>

          <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                <GitFork className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : stats?.followers || 0}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>

          <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all group">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                <GitPullRequest className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : "100+"}
              </div>
              <div className="text-sm text-muted-foreground">Contributions</div>
            </div>
          </div>
        </div>

        {/* Contribution Graph - Simplified */}
        <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Contribution Activity</h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              View Profile
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/39d353/${username}`}
              alt="GitHub Contribution Graph"
              className="w-full h-auto"
              style={{ minWidth: "700px" }}
            />
          </div>
        </div>

        {/* GitHub Link */}
        <div className="mt-8 text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-105 font-medium"
          >
            <Github className="h-5 w-5" />
            Follow me on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
