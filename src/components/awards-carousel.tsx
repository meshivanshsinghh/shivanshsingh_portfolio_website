"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Award {
  id: string;
  title: string;
  org: string;
  date: string;
  url?: string | null;
  imageUrl?: string | null;
  sponsor?: string | null;
  note?: string | null;
  linkLabel?: string | null;
}

export default function AwardsCarousel({ awards }: { awards: Award[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (awards.length === 0) return null;

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + awards.length) % awards.length);
  };
  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % awards.length);
  };

  const award = awards[index];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div>
      {/* Carousel viewport */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm min-h-[120px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-5 sm:p-6"
          >
            <div className="flex gap-4">
              {award.imageUrl && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                  <Image
                    src={award.imageUrl}
                    alt={award.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">
                      {award.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {award.org}
                      {award.sponsor ? ` · sponsored by ${award.sponsor}` : ""}
                    </p>
                    {award.note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {award.note}
                      </p>
                    )}
                    {award.url && (
                      <a
                        href={award.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2 font-medium"
                      >
                        {award.linkLabel || "View"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
                    {award.date}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      {awards.length > 1 && (
        <div className="flex items-center justify-between mt-3 px-1">
          <button
            onClick={prev}
            aria-label="Previous award"
            className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex gap-1.5">
            {awards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Go to award ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-foreground" : "bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next award"
            className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
