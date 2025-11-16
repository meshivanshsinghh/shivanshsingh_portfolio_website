import { experiences } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";
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
          Here is a quick summary of my{" "}
          <span className="text-primary">most recent experiences:</span>
        </h2>
      </div>

      {/* Experience List - Improved with Logo Support */}
      <div className="container max-w-5xl mx-auto px-4">
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[120px_1fr_auto] gap-8 items-start">
                {/* Company Logo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-20 h-20 rounded-2xl bg-background/50 border border-border/50 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-all shrink-0">
                    {exp.logo ? (
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={80}
                        height={80}
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {exp.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground text-center font-medium max-w-[120px]">
                    {exp.company}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  {exp.description && (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          <span className="leading-relaxed">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Period & Type */}
                <div className="flex md:flex-col items-start gap-3 md:items-end md:text-right shrink-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="whitespace-nowrap">{exp.period}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {exp.type}
                  </Badge>
                </div>
              </div>

              {/* Subtle hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}