import { experiences } from "@/data/experience";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section className="container max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
      </div>
      <p className="text-muted-foreground mb-12 text-lg">
        Companies I've had the pleasure of working with.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative group">
              {/* Timeline dot */}
              <div className="absolute left-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background hidden md:block -translate-x-1/2" />
              
              <div className="md:ml-16 bg-card border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-primary/50">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo/Initial */}
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ring-2 ring-primary/10">
                      <span className="text-xl font-bold text-primary">
                        {exp.company.charAt(0)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl mb-1">{exp.role}</h3>
                      <p className="text-primary font-semibold text-lg">{exp.company}</p>
                    </div>
                  </div>

                  {/* Period & Type */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      {exp.period}
                    </p>
                    <Badge variant="secondary" className="font-medium">
                      {exp.type}
                    </Badge>
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