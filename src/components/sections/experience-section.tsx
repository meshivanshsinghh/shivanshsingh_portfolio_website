import { experiences } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowUpRight } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section className="relative py-32">
      {/* Section Title */}
      <div className="container max-w-3xl mx-auto px-4 mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Experience</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Where I've <span className="text-primary">Worked</span>
        </h2>
      </div>

      {/* Experience List */}
      <div className="container max-w-3xl mx-auto px-4">
        <div className="space-y-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  {/* Company Icon */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      <span className="text-xl font-bold text-primary">
                        {exp.company.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-base font-semibold text-muted-foreground">
                          {exp.company}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="text-sm text-muted-foreground">
                        {exp.period}
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-medium bg-primary/10 text-primary border-primary/20"
                      >
                        {exp.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}