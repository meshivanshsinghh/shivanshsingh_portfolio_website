"use client";

import Image from "next/image";
import { ArrowUpRight, Trophy } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BentoAwardsProps {
  awards: any[];
}

export default function BentoAwards({ awards }: BentoAwardsProps) {
  // Only show awards that have a primary image OR a gallery
  const bentoAwards = awards.filter((a) => a.image?.asset || (a.gallery && a.gallery.length > 0));

  if (bentoAwards.length === 0) return null;

  return (
    // Mobile: stacked full-width cards (250px tall each)
    // Desktop: compact horizontal strip — cards sit side-by-side at 200px tall
    <div className="flex flex-col md:flex-row md:overflow-x-auto gap-4 md:pb-1 scrollbar-thin">
      {bentoAwards.map((award) => (
        <BentoTile key={award._id} award={award} />
      ))}
    </div>
  );
}

function BentoTile({ award }: { award: any }) {
  const size = award.bentoSize || "square";

  // Mobile: full-width, 250px tall
  // Desktop: fixed height 210px, width varies by bentoSize (like a compact strip)
  let sizeClasses = "";
  if (size === "large") {
    sizeClasses = "h-[250px] md:h-[210px] w-full md:w-[420px] md:shrink-0";
  } else if (size === "wide") {
    sizeClasses = "h-[250px] md:h-[210px] w-full md:w-[340px] md:shrink-0";
  } else {
    // square
    sizeClasses = "h-[250px] md:h-[210px] w-full md:w-[280px] md:shrink-0";
  }

  // Compile all images (primary + gallery)
  const images: string[] = [];
  if (award.image?.asset) {
    images.push(urlFor(award.image).width(1200).height(1200).url());
  }
  if (award.gallery && Array.isArray(award.gallery)) {
    award.gallery.forEach((gImg: any) => {
      if (gImg.asset) {
        images.push(urlFor(gImg).width(1200).height(1200).url());
      }
    });
  }

  // Remove duplicates just in case
  const uniqueImages = Array.from(new Set(images));

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-fading slideshow
  useEffect(() => {
    if (uniqueImages.length <= 1) return;
    
    // Cycle every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % uniqueImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [uniqueImages.length]);

  return (
    <a
      href={award.url || "#"}
      target={award.url ? "_blank" : "_self"}
      rel={award.url ? "noopener noreferrer" : ""}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-ring transition-all duration-300 ${sizeClasses}`}
    >
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {uniqueImages.map((imgUrl, i) => (
            i === currentIndex && (
              <motion.div
                key={imgUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={imgUrl}
                  alt={award.title}
                  fill
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Indicators for Gallery */}
      {uniqueImages.length > 1 && (
        <div className="absolute top-4 left-4 flex gap-1.5 z-10">
          {uniqueImages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>
      )}

      {/* Gradient Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      {/* Content at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end z-20">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] md:text-xs font-mono font-medium text-white/90 uppercase tracking-widest">
            {award.org}
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight mb-1">
              {award.title}
            </h3>
            {award.note && (
              <p className="text-xs md:text-sm text-white/70 line-clamp-1 md:line-clamp-2">{award.note}</p>
            )}
          </div>
          
          {/* Hover Action */}
          {award.url && (
            <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          )}
        </div>
      </div>
      
      {/* Date Tag at top right */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 z-20">
        <span className="text-[10px] md:text-xs font-mono text-white/90">{award.date}</span>
      </div>
    </a>
  );
}
