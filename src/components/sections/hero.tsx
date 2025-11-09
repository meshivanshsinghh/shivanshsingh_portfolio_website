import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Github, Linkedin } from "lucide-react";

export default function Hero() {
  return (
    <section className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Profile Image - Larger and more prominent */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-primary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-75" />
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden ring-4 ring-background">
            <Image
              src="/profile.jpg"
              alt="Shivansh Singh"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
            Hi, I'm <span className="text-primary">Shivansh Singh</span> 👋
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            I'm an <span className="text-foreground font-semibold">AI/ML Engineer</span> passionate about building intelligent systems.
            I love exploring the intersection of{" "}
            <span className="text-foreground font-semibold">engineering</span> and{" "}
            <span className="text-foreground font-semibold">machine learning</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button size="lg" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="mr-2 h-5 w-5" />
                Get in touch
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-5 w-5" />
                Resume
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-8 justify-center md:justify-start">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}