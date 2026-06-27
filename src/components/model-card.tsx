"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter, Youtube, Mail, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────

type Phase = "initializing" | "training" | "converged" | "expanded";

const TRAINING_EPOCHS = [
  { epoch: 1, loss: 2.341, lr: "3e-4", time: "00:12" },
  { epoch: 2, loss: 1.127, lr: "2e-4", time: "00:24" },
  { epoch: 3, loss: 0.483, lr: "1e-4", time: "00:36" },
  { epoch: 4, loss: 0.089, lr: "5e-5", time: "00:48" },
];
const TOTAL_EPOCHS = TRAINING_EPOCHS.length;

const CONFIG: { key: string; value: string; accent?: boolean }[] = [
  { key: "architecture", value: "Full-Stack ML Engineer" },
  { key: "training_data", value: "Northeastern University · M.S. Analytics" },
  { key: "performance", value: "GPA 3.96 / 4.0" },
  { key: "fine_tuned_on", value: "FIA Research · Travlog · Kaggle" },
  { key: "parameters", value: "2+ years industry experience" },
  { key: "status", value: "Available Sep 2026", accent: true },
];

const BIO_PRE =
  "Graduate student in Analytics at Northeastern University and software engineer with 2+ years of industry experience. I build at the intersection of ";
const BIO_BOLD = "machine learning and production systems";
const BIO_POST =
  " - from training pipelines to cloud-deployed APIs. Currently Tech Lead at the Feminine Intelligence Agency, leading a 30-student team evaluating LLMs on psychological reasoning tasks.";
const BIO = BIO_PRE + BIO_BOLD + BIO_POST;

const SOCIALS = [
  { name: "GitHub", href: "https://github.com/meshivanshsinghh", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/shivanshsinghh", icon: Linkedin },
  { name: "X", href: "https://x.com/shivanshneu", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@BackslashFlutter", icon: Youtube },
];

const T_DESKTOP = { init: 1600, trainDur: 2200, convergeDelta: 250, expandDelta: 350 };
const TRAIN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────────
// TQDM-STYLE TRAINING LOG LINE
// ─────────────────────────────────────────────────────────────────

function TqdmLine({
  epochData,
  index,
  visible,
  fillDuration,
}: {
  epochData: (typeof TRAINING_EPOCHS)[0];
  index: number;
  visible: boolean;
  fillDuration: number;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.05 }}
          className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono leading-relaxed"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {/* Timestamp */}
          <span className="text-muted-foreground/60 hidden sm:inline w-10 shrink-0">
            [{epochData.time}]
          </span>

          {/* Epoch label */}
          <span className="text-muted-foreground shrink-0">
            Epoch {epochData.epoch}/{TOTAL_EPOCHS}
          </span>

          {/* Progress bar */}
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-muted-foreground/50">|</span>
            <div className="w-[100px] sm:w-[120px] h-[7px] bg-[#222222] rounded-[2px] overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#cc0000] rounded-[2px]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: fillDuration,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </div>
            <span className="text-muted-foreground/50">|</span>
          </div>

          {/* 100% */}
          <motion.span
            className="text-green-600 font-medium shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: fillDuration, duration: 0.15 }}
          >
            100%
          </motion.span>

          {/* Metrics */}
          <motion.span
            className="text-muted-foreground truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: fillDuration * 0.5, duration: 0.2 }}
          >
            loss=
            <span className="text-foreground font-medium">{epochData.loss.toFixed(3)}</span>
            <span className="hidden sm:inline">
              {" "}lr={epochData.lr}
            </span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────
// TRAINING LOG PANEL
// ─────────────────────────────────────────────────────────────────

function TrainingLogs({
  epoch,
  isConverged,
  epochFillDur,
}: {
  epoch: number;
  isConverged: boolean;
  epochFillDur: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
        training output
      </p>

      <div className="space-y-1.5">
        {TRAINING_EPOCHS.map((ep, i) => (
          <TqdmLine
            key={ep.epoch}
            epochData={ep}
            index={i}
            visible={epoch >= ep.epoch}
            fillDuration={epochFillDur}
          />
        ))}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isConverged && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-[10px] sm:text-[11px] font-mono text-green-600 mt-3 pt-2 border-t border-border"
          >
            ✓ Training complete. Best loss: 0.089 · 4 epochs · 48s
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STREAMED BIO TEXT
// ─────────────────────────────────────────────────────────────────

function BioStream({ count }: { count: number }) {
  if (count <= 0) return null;
  const preLen = BIO_PRE.length;
  const boldLen = BIO_BOLD.length;
  if (count <= preLen) return <>{BIO.slice(0, count)}</>;
  if (count <= preLen + boldLen)
    return (
      <>
        {BIO_PRE}
        <span className="font-semibold text-foreground">{BIO.slice(preLen, count)}</span>
      </>
    );
  return (
    <>
      {BIO_PRE}
      <span className="font-semibold text-foreground">{BIO_BOLD}</span>
      {BIO.slice(preLen + boldLen, count)}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function ModelCard() {
  const [phase, setPhase] = useState<Phase>("initializing");
  const [epoch, setEpoch] = useState(0);
  const [bioCount, setBioCount] = useState(0);
  const [bioDone, setBioDone] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [bioInView, setBioInView] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef(false);

  // ── Initialize ────────────────────────────────────────
  useEffect(() => {
    const m = window.innerWidth < 768;
    setMobile(m);
    mobileRef.current = m;

    if (m) {
      // ─── MOBILE ───
      // If already played during this page lifecycle, jump straight to final state
      if ((window as unknown as Record<string, unknown>).__heroPlayed) {
        setEpoch(TOTAL_EPOCHS);
        setPhase("expanded");
        return;
      }

      // First visit: start training, sync epoch 4 with hero-complete event
      const initTimer = setTimeout(() => setPhase("training"), 200);
      const heroHandler = () => {
        setEpoch(TOTAL_EPOCHS);
        setTimeout(() => setPhase("converged"), 200);
        setTimeout(() => setPhase("expanded"), 550);
      };
      window.addEventListener("hero-complete", heroHandler);
      return () => {
        clearTimeout(initTimer);
        window.removeEventListener("hero-complete", heroHandler);
      };
    } else {
      // ─── DESKTOP ───
      // If already played during this page lifecycle, jump straight to final state
      if ((window as unknown as Record<string, unknown>).__heroPlayed) {
        setEpoch(TOTAL_EPOCHS);
        setPhase("expanded");
        return;
      }

      const t = T_DESKTOP;
      const timers = [
        setTimeout(() => setPhase("training"), t.init),
        setTimeout(() => setPhase("converged"), t.init + t.trainDur + t.convergeDelta),
        setTimeout(() => setPhase("expanded"), t.init + t.trainDur + t.convergeDelta + t.expandDelta),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, []);

  // ── Epoch counter ─────────────────────────────────────
  useEffect(() => {
    if (phase === "converged" || phase === "expanded") {
      setEpoch(TOTAL_EPOCHS);
      return;
    }
    if (phase !== "training") return;

    const m = mobileRef.current;

    if (m) {
      // Mobile: epochs 1-3 appear during hero animation, epoch 4 comes from hero-complete event
      // Hero timeline: 500ms(static) + 400ms(tokenizing) + 1000ms(tokens) = 1900ms
      // Training starts at ~200ms, hero completes at ~1900ms → ~1700ms of training
      // Space 3 epochs over ~1400ms → ~470ms each
      const step = 470;
      const timers = Array.from({ length: TOTAL_EPOCHS - 1 }, (_, i) =>
        setTimeout(() => setEpoch(i + 1), step * (i + 1))
      );
      return () => timers.forEach(clearTimeout);
    } else {
      // Desktop: all 4 epochs evenly spaced
      const dur = T_DESKTOP.trainDur;
      const step = dur / TOTAL_EPOCHS;
      const timers = Array.from({ length: TOTAL_EPOCHS }, (_, i) =>
        setTimeout(() => setEpoch(i + 1), step * (i + 1))
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  // ── IntersectionObserver for bio ──────────────────────
  useEffect(() => {
    if (phase !== "expanded" || bioDone) return;
    const el = bioRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setBioInView(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, bioDone]);

  // ── Bio streaming ─────────────────────────────────────
  useEffect(() => {
    if (!bioInView) return;
    const m = window.innerWidth < 768;
    const chunk = m ? 4 : 3;
    const delay = m ? 8 : 12;
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(i + chunk, BIO.length);
      setBioCount(i);
      if (i >= BIO.length) { clearInterval(id); setTimeout(() => setBioDone(true), 150); }
    }, delay);
    return () => clearInterval(id);
  }, [bioInView]);

  const isTraining = phase !== "initializing";
  const isConverged = phase === "converged" || phase === "expanded";
  // Mobile bars fill fast (each epoch visible briefly), desktop slower
  const epochFillDur = mobile ? 0.35 : 0.45;

  return (
    <section className="max-w-5xl mx-auto px-6 relative z-30 min-h-[580px] md:min-h-[420px]">
      <div className="rounded-xl border border-border bg-[#111111] shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cc0000]/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground ml-2 truncate">wandb / shivansh-v2026</span>
          </div>
          <div className="text-[10px] font-mono shrink-0">
            {isConverged ? (
              <span className="text-green-600 font-medium">✓ converged</span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1.5">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="inline-block">⟳</motion.span>
                {phase === "initializing" ? "initializing" : "training"}
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="min-h-[160px]">
          <AnimatePresence mode="wait">
            {!isTraining ? (
              <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="p-6 md:p-8">
                <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-sm font-mono text-zinc-800 font-medium">
                  &gt; Initializing training run...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                <div className="p-5 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Training logs (tqdm-style) */}
                    <div className="flex-1 min-w-0 md:max-w-[55%]">
                      <TrainingLogs
                        epoch={epoch}
                        isConverged={isConverged}
                        epochFillDur={epochFillDur}
                      />
                    </div>

                    {/* Config */}
                    <motion.div className="flex-1 min-w-0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-3">config</p>
                      <div className="space-y-2.5">
                        {CONFIG.map((f, i) => (
                          <motion.div key={f.key} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
                            className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3"
                          >
                            <span className="text-[11px] font-mono text-muted-foreground sm:w-28 shrink-0">{f.key}:</span>
                            <span className={`text-sm font-medium ${f.accent ? "text-[#cc0000]" : "text-foreground"}`}>
                              {f.accent && !isConverged ? (
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-muted-foreground">training...</motion.span>
                              ) : f.value}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Expanded bio */}
                <AnimatePresence>
                  {phase === "expanded" && (
                    <motion.div key="bio" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.5, ease: TRAIN_EASE }} className="overflow-hidden"
                    >
                      <div ref={bioRef} className="border-t border-border p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                          {/* Photo */}
                          <div className="shrink-0 flex justify-center md:justify-start">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border relative bg-[#1a1a1a]">
                              <Image src="/gpt_image.png" alt="Shivansh Singh" fill className="object-cover object-top" sizes="(max-width: 640px) 112px, 128px" quality={95} priority />
                            </div>
                          </div>

                          {/* Bio + action chips */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-relaxed min-h-[60px]">
                              <BioStream count={bioCount} />
                              {!bioDone && <span className="inline-block w-[2px] h-[14px] bg-foreground ml-0.5 translate-y-[2px] animate-cursor-blink" />}
                            </p>

                            {/* Terminal-style action chips */}
                            {bioDone && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: 0.1 }}
                                className="flex flex-wrap gap-2 mt-4"
                              >
                                {SOCIALS.map((s) => (
                                  <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 px-2.5 py-1.5 rounded-lg hover:bg-secondary/60 transition-all"
                                  >
                                    <s.icon className="h-3 w-3" />
                                    {s.name}
                                  </a>
                                ))}
                                <a
                                  href="mailto:singh.shivan@northeastern.edu"
                                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 px-2.5 py-1.5 rounded-lg hover:bg-secondary/60 transition-all"
                                >
                                  <Mail className="h-3 w-3" />
                                  Email
                                </a>
                                <a
                                  href="/resume.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#cc0000] border border-[#cc0000]/30 hover:bg-[#fff5f5] px-2.5 py-1.5 rounded-lg transition-all font-medium"
                                >
                                  <FileText className="h-3 w-3" />
                                  Resume ↗
                                </a>
                              </motion.div>
                            )}

                            {bioDone && (
                              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }} className="mt-4 text-[11px] font-mono text-green-600">
                                ✓ Checkpoint saved: shivansh-2026.pt · Available Sep 2026
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
