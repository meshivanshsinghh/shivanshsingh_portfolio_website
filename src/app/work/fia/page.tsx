import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feminine Intelligence Agency",
  description: "Tech Lead at the Feminine Intelligence Agency - leading LLM evaluation research on psychological reasoning.",
};

const bullets = [
  "Lead a 30-student research cohort evaluating whether LLMs can detect psychological manipulation using a 28-trait UNES clinical psychology framework.",
  "Built a Python evaluation pipeline that processes 170 Reddit relationship scenarios through GPT-4o, Claude, and DeepSeek in parallel, then computes inter-rater reliability using Cohen's kappa.",
  "Key finding: models detect early-stage danger reliably (2.25 Cohen's d effect size) but fail at fine-grained manipulation classification - 19% accuracy across 17 distinct manipulator archetypes.",
  "Managed student contributors across data annotation, pipeline testing, and statistical analysis - coordinating async research work across time zones.",
  "Worked directly with FIA leadership to shape the research design and align technical output with the organization's clinical psychology framework.",
];

const stack = [
  "Python", "GPT-4o", "Claude 3.5", "DeepSeek", "Pandas", "NumPy",
  "Cohen's Kappa", "NLP", "Statistical Analysis",
];

export default function FIAPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to about
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-foreground">Feminine Intelligence Agency</h1>
        </div>
        <p className="text-base font-medium text-foreground mb-4">Tech Lead</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            Jan 2026 - Present
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            Boston, MA
          </span>
          <span className="px-2 py-0.5 bg-secondary border border-border rounded text-muted-foreground">
            Contract
          </span>
          <span className="px-2 py-0.5 bg-[#cc0000]/10 border border-[#cc0000]/30 rounded text-[#cc0000] font-medium">
            Northeastern-affiliated research
          </span>
        </div>
      </div>

      {/* About */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          About
        </h2>
        <p className="text-sm text-foreground leading-relaxed">
          The Feminine Intelligence Agency is a Northeastern University-affiliated research project
          investigating the intersection of clinical psychology and AI. The core research question:
          can large language models reliably detect psychological manipulation in real-world
          relationship dynamics? I joined as Tech Lead to build the evaluation infrastructure and
          manage the research team.
        </p>
      </div>

      {/* What I do */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          What I Do
        </h2>
        <ul className="space-y-4">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground leading-relaxed">
              <span className="text-[#cc0000] font-bold shrink-0 mt-0.5">·</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stack */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Tools & Methods
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 bg-secondary border border-border rounded text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="border-t border-border pt-8 flex items-center justify-between">
        <Link
          href="/work/travlog"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Travlog
        </Link>
        <Link
          href="/about"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to about →
        </Link>
      </div>
    </div>
  );
}
