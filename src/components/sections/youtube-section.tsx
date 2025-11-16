"use client";

import { Play, Users, Video, Eye, Youtube, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, label: "Subscribers", value: "12.9K", color: "text-red-500" },
  { icon: Video, label: "Videos", value: "49", color: "text-blue-500" },
  { icon: Eye, label: "Views", value: "976K+", color: "text-purple-500" },
  { icon: TrendingUp, label: "Students Impacted", value: "10K+", color: "text-green-500" },
];

const featuredVideos = [
  {
    title: "Weather App Flutter | Creating Weather App in Flutter",
    thumbnail: "/youtube/weather-app.jpg", // Add your thumbnail
    duration: "2:33:08",
    views: "45K",
  },
  {
    title: "Flutter & Firebase Authentication | Auth with Google, Facebook & Twitter",
    thumbnail: "/youtube/firebase-auth.jpg",
    duration: "1:59:45",
    views: "38K",
  },
  {
    title: "Top 3 Simple But Effective Flutter Packages",
    thumbnail: "/youtube/flutter-packages.jpg",
    duration: "9:35",
    views: "22K",
  },
];

export default function YoutubeSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <Youtube className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Teaching Journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            From Teaching to Building:{" "}
            <span className="text-primary">My Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Before transitioning to AI/ML engineering, I taught app development to thousands 
            of students through my YouTube channel{" "}
            <span className="font-semibold text-foreground">Backslash Flutter</span>. 
            The experience of simplifying complex concepts and helping others build their 
            first apps shaped my approach to problem-solving and collaboration.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </div>
            );
          })}
        </div>

        {/* Featured Content */}
        <div className="relative bg-gradient-to-br from-red-500/10 via-primary/5 to-purple-500/10 border border-border/50 rounded-3xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left - Channel Info */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Youtube className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Backslash Flutter</h3>
                  <p className="text-sm text-muted-foreground">@backslashflutter</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-primary">✓</span>
                  </div>
                  <p className="text-muted-foreground">
                    Created <span className="font-semibold text-foreground">comprehensive tutorials</span> on Flutter & Dart development
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-primary">✓</span>
                  </div>
                  <p className="text-muted-foreground">
                    Taught <span className="font-semibold text-foreground">UI/UX design</span> principles for mobile apps
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-primary">✓</span>
                  </div>
                  <p className="text-muted-foreground">
                    Helped thousands of developers <span className="font-semibold text-foreground">build their first apps</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild variant="default" size="lg" className="group bg-red-600 hover:bg-red-700">
                  <a
                    href="https://www.youtube.com/@backslashflutter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="mr-2 h-5 w-5" />
                    Visit Channel
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://github.com/backslashflutter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source Code
                  </a>
                </Button>
              </div>
            </div>

            {/* Right - Video Preview Grid */}
            <div className="w-full md:w-96 shrink-0">
              <div className="grid grid-cols-1 gap-3">
                {featuredVideos.slice(0, 2).map((video, index) => (
                  <a
                    key={index}
                    href="https://www.youtube.com/@backslashflutter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex gap-3 p-3">
                      {/* Thumbnail */}
                      <div className="relative w-28 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20 shrink-0 flex items-center justify-center overflow-hidden">
                        <Play className="h-8 w-8 text-red-500 absolute z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-red-500/20" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                          {video.duration}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{video.views} views</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transition Story */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              This teaching experience helped me transition into AI/ML Engineering
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}