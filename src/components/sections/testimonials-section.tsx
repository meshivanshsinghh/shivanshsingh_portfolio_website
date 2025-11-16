"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sumit Kumar",
    role: "Senior Designer",
    company: "Smallcase",
    content:
      "I've had the pleasure of working with Sunal on a fast-moving project that has greatly benefited from his talents. Sunal is an intelligent, creative, team-oriented, and highly conscientious designer, and he has quickly become one of my favourite collaborators.",
    avatar: "SK",
  },
  {
    name: "Priya Sharma",
    role: "Engineering Manager",
    company: "Tech Corp",
    content:
      "Working with Shivansh has been fantastic. His ability to bridge the gap between machine learning and production systems is exceptional. He consistently delivers high-quality work on time.",
    avatar: "PS",
  },
  {
    name: "Alex Johnson",
    role: "Product Lead",
    company: "Startup Inc",
    content:
      "Shivansh's technical expertise and problem-solving skills are outstanding. He takes ownership of projects and always goes the extra mile to ensure success. A true team player.",
    avatar: "AJ",
  },
  {
    name: "Maria Garcia",
    role: "CTO",
    company: "AI Solutions",
    content:
      "Shivansh has a unique combination of ML expertise and software engineering skills. His contributions to our AI infrastructure have been invaluable. Highly recommend!",
    avatar: "MG",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Testimonial Of Few Folks
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Word On The Street <span className="text-primary">About Me</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Few words from people who collaborated with me
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
