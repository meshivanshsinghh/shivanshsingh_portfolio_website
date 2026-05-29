"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter, Youtube, Mail, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socials = [
  { name: "GitHub", href: "https://github.com/meshivanshsinghh", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/shivanshsinghh", icon: Linkedin },
  { name: "X", href: "https://x.com/shivanshneu", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@BackslashFlutter", icon: Youtube },
];

const modelFields = [
  { key: "architecture", value: "Full-Stack ML Engineer" },
  { key: "training_data", value: "Northeastern University · M.S. Analytics" },
  { key: "performance", value: "GPA 3.96 / 4.0" },
  { key: "fine_tuned_on", value: "FIA Research · Travlog · Kaggle" },
  { key: "parameters", value: "2+ years industry experience" },
  { key: "status", value: "Available Sep 2026" },
];

export default function ModelCard() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the hero tokenizing animation to finish
    const timer = setTimeout(() => setIsReady(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    // min-h-[500px] permanently reserves layout space so the dropdown animation doesn't pull the Tech Stack up into view
    <section className="max-w-4xl mx-auto px-6 relative z-30 min-h-[600px] md:min-h-[400px]">
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cc0000]/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground ml-2">
            model_card.json
          </span>
        </div>

        {/* Content Dropdown */}
        <AnimatePresence mode="wait">
          {!isReady ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 md:p-8 overflow-hidden"
            >
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-sm font-mono text-zinc-800 font-medium"
              >
                &gt; Initializing parameters...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="overflow-hidden"
            >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
            {/* Photo + socials */}
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
              <div className="w-28 h-28 rounded-xl overflow-hidden border border-border relative bg-secondary">
                <Image
                  src="/gpt_image.png"
                  alt="Shivansh Singh"
                  fill
                  className="object-cover object-top"
                  sizes="112px"
                  quality={95}
                  priority
                />
              </div>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <s.icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <a
                  href="mailto:singh.shivan@northeastern.edu"
                  className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  singh.shivan@northeastern.edu
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  resume.pdf
                </a>
              </div>
            </div>

            {/* Model fields */}
            <div className="flex-1 min-w-0">
              <div className="space-y-3.5">
                {modelFields.map((field) => (
                  <div key={field.key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground sm:w-36 shrink-0">
                      {field.key}:
                    </span>
                    <span className={`text-sm ${field.key === "status" ? "text-[#cc0000] font-medium" : "text-foreground font-medium"}`}>
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio paragraph */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-foreground leading-relaxed">
              Graduate student in Analytics at Northeastern University and software engineer with 2+
              years of industry experience. I build at the intersection of{" "}
              <span className="font-semibold text-foreground">machine learning and production systems</span> - from
              training pipelines to cloud-deployed APIs. Currently Tech Lead at the Feminine
              Intelligence Agency, leading a 30-student team evaluating LLMs on psychological
              reasoning tasks.
            </p>
          </div>
        </div>
      </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
