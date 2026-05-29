"use client";

import Link from "next/link";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

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
            I&apos;m a software engineer and analytics student at{" "}
            <span className="font-medium text-foreground">Northeastern University</span>, building things at the
            intersection of ML systems and cloud infrastructure. I&apos;m currently completing a
            Master&apos;s in Analytics (GPA 3.96, expected 2027).
          </p>
          <p>
            My day-to-day involves leading a 30-student research team at the{" "}
            <Link href="/work/fia" className="font-medium text-foreground underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors">
              Feminine Intelligence Agency
            </Link>, where we evaluate whether large language models can detect psychological
            manipulation in relationships - using a 28-trait UNES clinical psychology framework
            with GPT-4o, Claude, and DeepSeek.
          </p>
          <p>
            Before that, I was a Software Engineer at{" "}
            <Link href="/work/travlog" className="font-medium text-foreground underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors">
              Travlog
            </Link>{" "}
            (a YC-tracked startup), where I built a cross-platform social travel app from scratch -
            offline-first SQLite storage, AWS cloud architecture, and a Node.js + Kotlin backend
            managing 40+ REST endpoints.
          </p>
          <p>
            I compete on Kaggle and build production ML systems - from agentic clinical AI pipelines
            to production RAG systems deployed on AWS with full observability.
          </p>
          <p>
            Outside of work, I run a YouTube channel originally about Flutter development, now
            evolving toward AI/ML systems and applied research.
          </p>
        </div>

        {/* Quick facts */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Years of experience", value: "2+" },
            { label: "GPA (Northeastern)", value: "3.96" },
            { label: "Student researchers led", value: "30" },
          ].map((fact) => (
            <div key={fact.label} className="border border-border rounded-lg p-4 bg-secondary/50">
              <div className="text-xl font-semibold text-foreground mb-1">{fact.value}</div>
              <div className="text-xs text-muted-foreground leading-snug">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience / Education tabs */}
      <div>
        {/* Tab nav */}
        <div className="flex gap-0 border-b border-border mb-8">
          {(["experience", "education"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-4 py-2 -mb-px border-b-2 transition-colors capitalize ${activeTab === tab
                  ? "border-accent text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "experience" ? "Work Experience" : "Education"}
            </button>
          ))}
        </div>

        {/* Experience */}
        {activeTab === "experience" && (
          <div className="space-y-0 divide-y divide-border">
            {experiences.map((exp, i) => (
              <div key={i} className="py-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {exp.role}
                      <span className="font-normal text-muted-foreground"> · {exp.company}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exp.type} · {exp.location}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                    {exp.period}
                  </span>
                </div>

                {exp.description && (
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-accent shrink-0 mt-0.5">·</span>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.skills && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 bg-secondary text-foreground border border-border rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div className="space-y-0 divide-y divide-border">
            {education.map((edu, i) => (
              <div key={i} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {edu.school}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {edu.degree}, {edu.field}
                      {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                    </p>
                    {edu.location && (
                      <p className="text-xs text-muted-foreground mt-0.5">{edu.location}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
