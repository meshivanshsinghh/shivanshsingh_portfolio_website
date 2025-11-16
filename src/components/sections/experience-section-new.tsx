import { experiences } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

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

      {/* Experience Timeline */}
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-[200px_1fr] gap-8">
          {/* Left Sidebar - Company Names */}
          <div className="hidden md:flex md:flex-col md:gap-6 md:pt-2">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/30" />
              
              {/* Company list */}
              <div className="flex flex-col gap-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Dot indicator */}
                    <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    
                    <div className="text-sm font-medium text-primary">
                      {exp.company}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Experience Details */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="space-y-4">
                {/* Mobile company name */}
                <div className="md:hidden text-sm font-medium text-primary mb-2">
                  {exp.company}
                </div>

                {/* Role and Period */}
                <div>
                  <h3 className="text-2xl font-bold">
                    {exp.role}{" "}
                    <span className="text-primary">@ {exp.company}</span>
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-muted-foreground">
                      {exp.period}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {exp.type}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <ul className="space-y-3">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground">
                        <span className="text-primary mt-1.5 shrink-0">▹</span>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
