import { experiences } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

export default function ExperienceSection() {
  return (
    <section className="relative py-20">
      {/* Section Title */}
      <div className="container max-w-5xl mx-auto px-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Experience</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Where I've <span className="text-primary">Worked</span>
        </h2>
      </div>

      {/* Experience List */}
      <div className="container max-w-5xl mx-auto px-4">
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
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-base text-muted-foreground">
                        {exp.company} · {exp.type}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {exp.type}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{exp.period}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <ul className="space-y-2">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Skills/Technologies */}
                  {exp.skills && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
