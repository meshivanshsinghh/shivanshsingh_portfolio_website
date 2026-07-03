"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simulated BPE-style tokenization with realistic token IDs
const TOKENS = [
  { text: " ML", id: 10373 },
  { text: " Eng", id: 4280 },
  { text: "ineer", id: 15843 },
  { text: " &", id: 1222 },
  { text: " Sys", id: 17633 },
  { text: "tems", id: 11991 },
  { text: " Build", id: 11819 },
  { text: "er", id: 263 },
];

const TOKEN_GROUPS = [
  { word: "ML", tokens: [0] },
  { word: "Engineer", tokens: [1, 2] },
  { word: "&", tokens: [3], separator: true },
  { word: "Systems", tokens: [4, 5] },
  { word: "Builder", tokens: [6, 7] },
];

// ─────────────────────────────────────────────────────────────────
// EXPERTISE WATERMARKS
// ─────────────────────────────────────────────────────────────────

const PYTORCH_LINES = [
  <><span className="text-[#cc0000] font-semibold">class</span> MultiHeadAttention(nn.Module):</>,
  <>{"    "}<span className="text-[#cc0000] font-semibold">def</span> __init__(self, d_model, num_heads):</>,
  <>{"        "}<span className="text-[#cc0000] font-semibold">super</span>().__init__()</>,
  <>{"        "}<span className="text-[#cc0000]">self</span>.q_proj = nn.Linear(d_model, d_model)</>,
  <>{"        "}<span className="text-[#cc0000]">self</span>.k_proj = nn.Linear(d_model, d_model)</>,
  <>{"        "}<span className="text-[#cc0000]">self</span>.v_proj = nn.Linear(d_model, d_model)</>,
  <></>,
  <>{"    "}<span className="text-[#cc0000] font-semibold">def</span> forward(self, x, mask=<span className="text-[#cc0000] font-semibold">None</span>):</>,
  <>{"        "}batch, seq, d_model = x.size()</>,
  <>{"        "}q = <span className="text-[#cc0000]">self</span>.q_proj(x).view(batch, seq, heads, d_k)</>,
  <>{"        "}k = <span className="text-[#cc0000]">self</span>.k_proj(x).view(batch, seq, heads, d_k)</>,
  <>{"        "}v = <span className="text-[#cc0000]">self</span>.v_proj(x).view(batch, seq, heads, d_k)</>,
  <></>,
  <>{"        "}scores = torch.matmul(q, k.transpose(-2, -1))</>,
  <>{"        "}scores = scores / math.sqrt(d_k)</>,
  <></>,
  <>{"        "}attn = F.softmax(scores, dim=-1)</>,
  <>{"        "}<span className="text-[#cc0000] font-semibold">return</span> torch.matmul(attn, v)</>
];

const SYSTEM_LOG_LINES = [
  <><span className="text-[#cc0000] font-semibold">[INFO]</span> Load state_dict from checkpoint...</>,
  <><span className="text-[#cc0000] font-semibold">[INFO]</span> Distributed setup: world_size=8</>,
  <><span className="text-[#cc0000] font-semibold">[INFO]</span> Model config: LlamaConfig</>,
  <>{"  "}hidden_size: 4096</>,
  <>{"  "}num_attention_heads: 32</>,
  <>{"  "}num_hidden_layers: 32</>,
  <><span className="text-[#cc0000] font-semibold">[INFO]</span> Allocating KV cache...</>,
  <>{"{"}<span className="text-[#cc0000]">"event"</span>: "generation", "tokens": 1024, "ms": 48.2{"}"}</>,
  <>{"{"}<span className="text-[#cc0000]">"event"</span>: "throughput", "tok_per_sec": 21244.1{"}"}</>,
  <><span className="text-[#cc0000] font-semibold">[INFO]</span> Serving API on 0.0.0.0:8000</>,
  <><span className="text-[#cc0000] font-semibold">200 GET</span>  /v1/completions (12.4ms)</>,
  <><span className="text-[#cc0000] font-semibold">200 POST</span> /v1/embeddings (8.1ms)</>
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.5 } }
};
const lineVariants = { hidden: { opacity: 0, x: -5 }, show: { opacity: 1, x: 0 } };
const logContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.8 } }
};
const logLineVariants = { hidden: { opacity: 0, y: 5 }, show: { opacity: 1, y: 0 } };

const PytorchCode = () => (
  <motion.pre variants={containerVariants} initial="hidden" animate="show"
    className="font-mono bg-transparent border-0 p-0 m-0 overflow-visible text-[10px] lg:text-[11px] tracking-tight leading-relaxed flex flex-col"
    style={{ color: "var(--hero-code-text)" }}
  >
    <motion.div variants={lineVariants} className="flex gap-1.5 mb-3 opacity-60">
      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
    </motion.div>
    {PYTORCH_LINES.map((line, i) => (
      <motion.div key={i} variants={lineVariants} className="min-h-[1em]">{line}</motion.div>
    ))}
  </motion.pre>
);

const SystemLogs = () => (
  <motion.pre variants={logContainerVariants} initial="hidden" animate="show"
    className="font-mono bg-transparent border-0 p-0 m-0 overflow-visible text-[10px] lg:text-[11px] tracking-tight leading-relaxed flex flex-col items-end text-right"
    style={{ color: "var(--hero-code-text)" }}
  >
    <motion.div variants={logLineVariants} className="flex gap-1.5 mb-3 opacity-30 justify-end">
      <div className="w-2 h-2 rounded-full bg-foreground/30" />
      <div className="w-2 h-2 rounded-full bg-foreground/30" />
      <div className="w-2 h-2 rounded-full bg-foreground/30" />
    </motion.div>
    {SYSTEM_LOG_LINES.map((line, i) => (
      <motion.div key={i} variants={logLineVariants} className="min-h-[1em]">{line}</motion.div>
    ))}
  </motion.pre>
);

function CodeWatermark() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 hidden md:block"
      style={{
        maskImage: "linear-gradient(to right, black 0%, black 15%, transparent 35%, transparent 65%, black 85%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 0%, black 15%, transparent 35%, transparent 65%, black 85%, black 100%)"
      }}
    >
      <div className="absolute top-[40%] -translate-y-1/2 left-2 lg:left-8 opacity-50"><PytorchCode /></div>
      <div className="absolute top-[40%] -translate-y-1/2 right-2 lg:right-8 opacity-50"><SystemLogs /></div>
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function TokenHero() {
  const [phase, setPhase] = useState<"static" | "tokenizing" | "tokens" | "attention">("static");

  useEffect(() => {
    // If already seen during this page lifecycle (client-side nav), skip animation.
    // window.__heroPlayed survives Next.js router navigations but clears on reload.
    if ((window as unknown as Record<string, unknown>).__heroPlayed) {
      setPhase("attention");
      window.dispatchEvent(new CustomEvent("hero-complete"));
      return;
    }

    const m = window.innerWidth < 768;

    // static → tokenizing
    const t1 = setTimeout(() => setPhase("tokenizing"), m ? 500 : 1000);
    // tokenizing → tokens
    const t2 = setTimeout(() => setPhase("tokens"), m ? 900 : 1600);
    // tokens → attention (hero complete)
    const t3 = setTimeout(() => {
      setPhase("attention");
      (window as unknown as Record<string, unknown>).__heroPlayed = true;
      window.dispatchEvent(new CustomEvent("hero-complete"));
    }, m ? 1900 : 3400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-[260px] sm:min-h-[300px] md:min-h-[380px] flex items-center justify-center overflow-hidden pt-10 pb-6 md:pt-16 md:pb-8">
      <CodeWatermark />

      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-3xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-3"
        >
          Shivansh Singh
        </motion.h1>

        <div className="min-h-[140px] md:min-h-[120px] flex flex-col items-center justify-start mt-2">
          <AnimatePresence mode="wait">
            {phase === "static" && (
              <motion.div key="static" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center pt-2"
              >
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light px-4">
                  ML Engineer &amp; Systems Builder
                </p>
              </motion.div>
            )}

            {phase === "tokenizing" && (
              <motion.div key="tokenizing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
                className="flex flex-col items-center pt-2"
              >
                <div className="flex items-center gap-2 text-sm text-foreground font-mono bg-card/90 backdrop-blur-md px-5 py-2 rounded-full shadow-sm border border-border">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>running tiktoken (cl100k_base)...</span>
                </div>
              </motion.div>
            )}

            {(phase === "tokens" || phase === "attention") && (
              <motion.div key="tokens" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }} className="w-full flex flex-col items-center pt-1"
              >
                <div className="flex flex-wrap items-end justify-center gap-x-1.5 gap-y-3 px-2">
                  {TOKEN_GROUPS.map((group, gi) => (
                    <div key={`sub-${gi}`} className="flex items-end gap-0.5">
                      {group.separator ? (
                        <span className="text-muted-foreground text-sm sm:text-base px-1 pb-1 font-mono border border-border bg-secondary rounded px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-sm">{"&"}</span>
                      ) : (
                        group.tokens.map((ti, idx) => {
                          const token = TOKENS[ti];
                          return (
                            <motion.div key={`sub-${gi}-${idx}`}
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: ti * 0.05, ease: "easeOut" }}
                              className="group flex flex-col items-center gap-1 cursor-default"
                            >
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: phase === "attention" ? 0.8 : 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: ti * 0.03 }}
                                className="text-[9px] sm:text-[10px] font-mono text-muted-foreground whitespace-nowrap h-3 bg-muted px-1 rounded shadow-sm border border-border/50"
                              >
                                {token.id}
                              </motion.span>
                              <span className={`inline-block px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-sm sm:text-base font-mono border transition-all duration-300 shadow-sm ${
                                phase === "attention"
                                  ? "border-accent/40 bg-accent/10 text-accent"
                                  : "border-border bg-secondary text-foreground hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                              }`}>
                                {token.text.trim()}
                              </span>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-mono text-muted-foreground pt-5"
                >
                  <span className="bg-card backdrop-blur-md px-2 py-0.5 rounded border border-border shadow-sm">tokens: {TOKENS.length}</span>
                  <span className="bg-card backdrop-blur-md px-2 py-0.5 rounded border border-border shadow-sm">vocab: gpt-4o</span>
                  <span className="bg-card backdrop-blur-md px-2 py-0.5 rounded border border-border shadow-sm">encoding: cl100k_base</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
