import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function ExperienceEducationSection() {
  return (
    <section className="relative py-20">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Work Experience Column */}
          <div className="md:col-span-1">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Experience</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Work <span className="text-primary">Experience</span>
              </h2>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-lg bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                        {exp.logo ? (
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-primary">
                            {exp.company.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                        {exp.company}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exp.role}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {exp.period}
                      </p>

                      {/* Description */}
                      {exp.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exp.description[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Education Column - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Education</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-primary">Education</span>
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* School Logo */}
                    <div className="flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-lg bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                        {edu.logo ? (
                          <Image
                            src={edu.logo}
                            alt={`${edu.school} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-primary">
                            {edu.school.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                        {edu.school}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {edu.degree}, {edu.field}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.period}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-muted-foreground mt-2">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learn More Link - Only visible on mobile */}
        <div className="md:hidden mt-8 text-center">
          <a
            href="/about"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Learn more about me
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
