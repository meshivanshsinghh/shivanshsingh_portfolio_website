"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Download, ExternalLink, Calendar, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Resume
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="mailto:singh.shiva@northeastern.edu">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-primary">Available for opportunities</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Hi, I'm <span className="text-primary">Shivansh</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                An AI/ML Engineer building intelligent systems at the intersection of 
                <span className="text-foreground font-semibold"> engineering</span> and 
                <span className="text-foreground font-semibold"> machine learning</span>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Boston, MA</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Software Engineer</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Northeastern University</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="text-4xl font-bold text-primary mb-2">2+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Projects Built</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="text-4xl font-bold text-primary mb-2">4.0</div>
                <div className="text-sm text-muted-foreground">GPA</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Contributions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Story with Avatar */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-8xl font-bold text-primary">SS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                My <span className="text-primary">Story</span>
              </h2>
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  I'm currently pursuing my Master's in Analytics at Northeastern University, where I'm diving deep into 
                  the world of data science and machine learning. My journey in tech has been driven by a passion for 
                  creating solutions that make a real impact.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  At Travlog Inc, I led the development of a cross-platform social travel app from scratch, architecting 
                  scalable backend systems on AWS and implementing ML-powered features. The experience taught me the 
                  importance of building systems that not only work but scale gracefully.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I love working on projects that combine data science, machine learning, and full-stack development. 
                  Whether it's building ETL pipelines processing 100K+ daily posts or creating AI-powered sentiment 
                  analysis systems, I'm always excited to tackle challenging problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Education Tabs */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Tab Buttons */}
          <div className="flex gap-4 mb-12">
            <button
              onClick={() => setActiveTab("experience")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "experience"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card/30 text-muted-foreground hover:bg-card/50"
              }`}
            >
              <Briefcase className="h-4 w-4 inline mr-2" />
              Work Experience
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "education"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card/30 text-muted-foreground hover:bg-card/50"
              }`}
            >
              <GraduationCap className="h-4 w-4 inline mr-2" />
              Education
            </button>
          </div>

          {/* Experience Content */}
          {activeTab === "experience" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="group bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-all">
                        {exp.logo ? (
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            {exp.company.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-1">
                            {exp.role}
                          </h3>
                          <p className="text-lg text-muted-foreground mb-2">
                            {exp.company} · {exp.type}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {exp.period}
                            </div>
                            {exp.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {exp.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <ul className="space-y-3 mb-6">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="flex gap-3 text-muted-foreground">
                              <span className="text-primary mt-1 shrink-0">▹</span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.skills && (
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Content */}
          {activeTab === "education" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="group bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-all">
                        {edu.logo ? (
                          <Image
                            src={edu.logo}
                            alt={`${edu.school} logo`}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary">
                            {edu.school.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-1">
                        {edu.school}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-2">
                        {edu.degree}, {edu.field}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {edu.period}
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {edu.location}
                          </div>
                        )}
                      </div>
                      {edu.gpa && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                          <span className="font-semibold">GPA: {edu.gpa}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Work <span className="text-primary">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="mailto:singh.shiva@northeastern.edu">
                <Mail className="mr-2 h-5 w-5" />
                Send me an email
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://linkedin.com/in/shivanshsinghh" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
