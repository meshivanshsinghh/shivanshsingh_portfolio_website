import { experiences } from "@/data/experience";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExperienceSection() {
  return (
    <section className="container max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold tracking-tight mb-3">Experience</h2>
      <p className="text-muted-foreground mb-8">
        Here are some of the companies I've had the pleasure of working with.
      </p>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Company Logo */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold">
                    {exp.company.charAt(0)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{exp.company}</h3>
                  <p className="text-muted-foreground">{exp.role}</p>
                </div>
              </div>

              {/* Period & Type */}
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{exp.period}</p>
                <Badge variant="secondary" className="mt-1">
                  {exp.type}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}