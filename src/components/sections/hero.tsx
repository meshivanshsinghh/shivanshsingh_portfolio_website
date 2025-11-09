import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 bg-linear-to-br from-primary/20 to-primary/5">
          <Image
            src="/profile.jpg" // Add your profile image to public/
            alt="Shivansh Singh"
            width={160}
            height={160}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Hi, I'm Shivansh Singh 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            I'm an AI/ML engineer. I{" "}
            <span className="text-foreground font-medium">code</span>,{" "}
            <span className="text-foreground font-medium">build</span>, and{" "}
            <span className="text-foreground font-medium">deploy</span> intelligent systems.
          </p>
          <p className="text-base text-muted-foreground mb-6">
            I love learning while working on AI/ML projects, where I explore
            the space between engineering and machine learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact me
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Get my CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}