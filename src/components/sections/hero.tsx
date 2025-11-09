"use client";

import { Button } from "@/components/ui/button";
import {
  Mail,
  FileText,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  MapPin,
} from "lucide-react";
import dynamic from "next/dynamic";
import { SanityAnnouncement } from "@/types/sanity";

const Globe = dynamic(() => import("@/components/three/globe"), {
  ssr: false,
  loading: () => null, // Remove the duplicate loader
});

interface HeroProps {
  announcement?: SanityAnnouncement;
}

export default function Hero({ announcement }: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Grid layout with proper containment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:items-center">
          {/* Left Content - Shows second on mobile, first (left) on desktop */}
          <div className="space-y-8 order-2 md:order-1">
            {/* Dynamic Announcement Badge */}
            {announcement?.isActive && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">{announcement.text}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Boston, MA</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="block text-muted-foreground text-2xl md:text-3xl font-normal mb-2">
                  Hi, I'm
                </span>
                <span className="block bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Shivansh Singh
                </span>
              </h1>

              <p className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                AI/ML Engineer
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Building intelligent systems at the intersection of{" "}
              <span className="text-foreground font-semibold">engineering</span>{" "}
              and{" "}
              <span className="text-foreground font-semibold">
                machine learning
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group" asChild>
                <a href="mailto:your.email@example.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group backdrop-blur-sm"
                asChild
              >
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-5 w-5" />
                  View Resume
                </a>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm text-muted-foreground">Connect:</span>
              <div className="flex gap-3">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right - 3D Globe Container with proper boundaries */}
          <div className="hidden md:block relative w-full h-[350px] md:h-[450px] lg:h-[500px] order-1 md:order-2 overflow-hidden rounded-2xl">
            {/* Globe wrapper with absolute positioning */}
            <div className="absolute inset-0" style={{ isolation: 'isolate' }}>
              <Globe />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}