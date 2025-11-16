"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, FileText, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/three/globe"), {
  ssr: false,
  loading: () => null,
});

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-35">
      <svg
        className="w-full h-full text-primary"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={0.6 + path.id * 0.025}
            strokeOpacity={0.12 + path.id * 0.025}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function AnimatedHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        {/* Grid layout with Globe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:items-center">
          {/* Left Content */}
          <div className="space-y-8 order-2 md:order-1">
            {/* Status Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Available for opportunities</span>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Boston, MA</span>
            </motion.div>

            {/* Main Heading with Letter Animation */}
            <div className="space-y-4">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="block text-muted-foreground text-2xl md:text-3xl font-normal"
              >
                Hi, I'm
              </motion.span>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                {"Shivansh Singh".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              >
                AI/ML Engineer
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Building intelligent systems at the intersection of{" "}
              <span className="text-foreground font-semibold">engineering</span> and{" "}
              <span className="text-foreground font-semibold">machine learning</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="group" asChild>
                <a href="mailto:singh.shiva@northeastern.edu">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group backdrop-blur-sm"
                asChild
              >
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-5 w-5" />
                  View Resume
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right - 3D Globe with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden md:block relative w-full h-[350px] md:h-[450px] lg:h-[500px] order-1 md:order-2 overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0" style={{ isolation: 'isolate' }}>
              <Globe />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
