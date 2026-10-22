"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./story.css";

// ─────────────────────────────────────────────────────────────────
// REFERRAL DETAILS
// ─────────────────────────────────────────────────────────────────

const JOB_ID = "10583340";
const JOB_TITLE = "Software Development Engineer, Early Career 2027 (US)";
const JOB_URL =
  "https://www.amazon.jobs/en/jobs/10583340/software-development-engineer-early-career-2027-us";
// Same email as the resume: Amazon matches the referral to the candidate by email.
const EMAIL = "shivanshneu@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/shivanshsinghh";

// Written so a referrer can paste it straight into the referral form.
const NOTE =
  "Shivansh Singh graduates from Northeastern in December 2026 with a Master of Professional Studies in Analytics (GPA 3.96). At Travlog, a YC-track startup, engineered the mobile and backend stack on AWS and Firebase. Also built a client app with over 1M Play Store downloads, won 1st place at the GDG Cloud Boston × Northeastern hackathon with git-to-doc, which checks AI-written commit messages against the code, and built lurq, which checks npm packages before AI coding agents install them. A strong match for this role's focus on validating AI-generated code.";

// ─────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────

// How long each screen plays, in ms. The last one waits for the viewer.
const DURATIONS = [6000, 5000, 4800, 6200, 5800, 5800, 6500, 0];
const LAST = DURATIONS.length - 1;

// The bottom timeline: one stop per screen after the first.
const MILESTONES = ["YouTube", "ExaWeather", "Travlog", "FIA", "Hackathon", "lurq", "Amazon"];

// Read out by screen readers as each screen comes up.
const SCREEN_LABELS = [
  "Shivansh Singh. I'm applying for Amazon's SDE, Early Career 2027 role. Here's what I've worked on so far. It takes under a minute, and the referral details are on the last screen.",
  "During the pandemic I taught myself Flutter, then taught it on YouTube. 12,000+ subscribers and 1 million views. Students used my tutorials for their assignments.",
  "I built a weather app for a client, ExaWeather. Over 1,000,000 Play Store downloads. The client retired it in 2025.",
  "At Travlog I was the founding mobile engineer and built the Flutter app and AWS backend from zero to launch. Then I fixed silent push failures by sending in batches of 500 and adding monitoring.",
  "At FIA I led a 13-person research team testing whether GPT-4o, Claude and DeepSeek can spot manipulation in 170 relationship scenarios from Reddit. They reliably flagged clearly dangerous situations, averaging 7.6 out of 10, but named the right kind of manipulation only 19% of the time.",
  "I won a Google Cloud hackathon, 1st place at GDG Cloud Boston × Northeastern, with git-to-doc, which checks whether an AI-written commit message matches the code.",
  "Then I built lurq. AI coding agents install packages from memory, so they often pick old or made-up versions. lurq is a live index they check first: whether the package exists, its latest version, API changes and security advisories. In one test, my agent picked 34 package versions and 33 were out of date.",
  `Next: Amazon? Would you refer me for job ${JOB_ID}? The job ID, my email and a note are below.`,
];

const REACTIONS = Array.from({ length: 10 }, (_, f) => f);
const DOWNLOAD_DOTS = Array.from({ length: 100 }, (_, i) => i); // 10K each
const PACKETS = ["ok", "bad", "ok", "ok", "bad", "ok", "bad"];
const LURQ_CHECKS = ["Does it exist", "Latest version", "API changes", "Security advisories"];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

const isControl = (t: EventTarget | null) =>
  t instanceof Element && !!t.closest("a,button,textarea");

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const m = window.matchMedia(MOTION_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
const prefersReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;

// LinkedIn's in-app browser can block the async clipboard API.
function legacyCopy(text: string) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Section marker in the site's style, naming the Leadership Principle the screen shows.
function Principle({ children }: { children: string }) {
  return (
    <p className="lbl" title="Amazon Leadership Principle">
      {children}
    </p>
  );
}

// Counts up once the screen starts and holds while the story is paused.
// Screens remount on entry, so this restarts every time one comes up.
function Counter({ to, delay, ms, paused, reduce }: { to: number; delay: number; ms: number; paused: boolean; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
    if (reduce) {
      el.textContent = fmt(to);
      return;
    }
    let clock = 0;
    let last = 0;
    let raf = 0;
    const tick = (t: number) => {
      if (last && !pausedRef.current) clock += t - last;
      last = t;
      const x = Math.max(0, Math.min(1, (clock - delay) / ms));
      el.textContent = fmt(to * (1 - Math.pow(1 - x, 3)));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delay, ms, reduce]);

  return <span ref={ref}>0</span>;
}

// ─────────────────────────────────────────────────────────────────
// STORY
// ─────────────────────────────────────────────────────────────────

export default function ReferralStory({ hasResume }: { hasResume: boolean }) {
  // runs[i] bumps every time screen i starts, which remounts it and replays its animations.
  // The previous screen stays "live" while it fades out so it doesn't snap back to its start state.
  const [nav, setNav] = useState({ cur: 0, prev: -1, runs: DURATIONS.map(() => 0) });
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [fallback, setFallback] = useState<string | null>(null);
  const press = useRef({ down: false, held: false, x: 0, y: 0, timer: 0 });
  const pausedByHide = useRef(false);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);

  const go = useCallback((to: number | ((cur: number) => number), replay = false) => {
    setNav((s) => {
      const n = Math.max(0, Math.min(LAST, typeof to === "function" ? to(s.cur) : to));
      if (n === s.cur && !replay) return s;
      const runs = [...s.runs];
      runs[n] += 1;
      return { cur: n, prev: n === s.cur ? s.prev : s.cur, runs };
    });
    setPaused(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go((c) => c + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go((c) => c - 1);
      } else if ((e.key === " " || e.key === "k") && !isControl(e.target)) {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        setPaused((p) => {
          if (!p) pausedByHide.current = true;
          return true;
        });
      } else if (pausedByHide.current) {
        pausedByHide.current = false;
        setPaused(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [go]);

  useEffect(() => {
    if (fallback) boxRef.current?.select();
  }, [fallback]);

  // Tap the left 30% to go back, anywhere else for next. Hold to pause, swipe either way.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || isControl(e.target)) return;
    const p = press.current;
    p.down = true;
    p.held = false;
    p.x = e.clientX;
    p.y = e.clientY;
    window.clearTimeout(p.timer);
    p.timer = window.setTimeout(() => {
      if (!p.down) return;
      p.held = true;
      setHolding(true);
      setPaused(true);
    }, 230);
  };

  const endPress = (e: React.PointerEvent, cancelled: boolean) => {
    const p = press.current;
    if (!p.down) return;
    p.down = false;
    window.clearTimeout(p.timer);
    if (p.held) {
      p.held = false;
      setHolding(false);
      setPaused(false);
      return;
    }
    if (cancelled) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      go((c) => c + (dx < 0 ? 1 : -1));
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    go((c) => c + (e.clientX - r.left < r.width * 0.3 ? -1 : 1));
  };

  const copy = (id: string, text: string) => {
    const done = (ok: boolean) => {
      if (!ok) {
        setFallback(text);
        return;
      }
      setFallback(null);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => done(true),
        () => done(legacyCopy(text))
      );
    } else {
      done(legacyCopy(text));
    }
  };

  const scene = (i: number) =>
    `scene s${i + 1}${i === nav.cur ? " show live" : i === nav.prev ? " live" : ""}`;
  const key = (i: number) => `${i}-${nav.runs[i]}`;
  const count = (to: number, delay: number, ms: number) => (
    <Counter to={to} delay={delay} ms={ms} paused={paused} reduce={reduce} />
  );

  // Timeline position: screen 0 has no stop, screens 1..7 map to MILESTONES 0..6.
  const stop = nav.cur - 1;
  const frac = stop >= 0 ? stop / (MILESTONES.length - 1) : 0;

  return (
    <div className="story dark" data-pal={nav.cur}>
      {/* Desktop only: ties the page back to the main site */}
      <header className="site">
        <Link href="/" className="brand">
          <span className="ss">SS</span>
          Shivansh Singh
        </Link>
        <Link href="/" className="visit">
          Full website →
        </Link>
      </header>

      <section
        className={`stage${paused ? " paused" : ""}${holding ? " holding" : ""}${nav.cur === LAST ? " at-end" : ""}`}
        aria-label="Why refer Shivansh Singh"
        onPointerDown={onPointerDown}
        onPointerUp={(e) => endPress(e, false)}
        onPointerCancel={(e) => endPress(e, true)}
        onContextMenu={(e) => {
          if (!isControl(e.target)) e.preventDefault();
        }}
      >
        <div className="glow" aria-hidden="true">
          <i className="g1" />
          <i className="g2" />
        </div>

        {/* ── Top chrome: progress, who, pause, skip ── */}
        <div className="chrome">
          <div className="bars">
            {DURATIONS.map((d, m) => (
              <span
                key={m}
                className={`seg${m < nav.cur ? " done" : ""}${m === nav.cur ? (d && !reduce ? " run" : " done") : ""}`}
              >
                <i
                  key={nav.runs[m]}
                  style={vars({ "--dur": `${d}ms` })}
                  onAnimationEnd={m === nav.cur ? () => go(m + 1) : undefined}
                />
              </span>
            ))}
          </div>
          <div className="who">
            <Link href="/" className="me" aria-label="Open shivanshsingh.in">
              <span className="avatar">
                <Image src="/gpt_image.png" alt="" fill sizes="40px" className="object-cover object-top" />
              </span>
              <span className="me-t">
                <b>Shivansh Singh</b>
                <small>shivanshsingh.in</small>
              </span>
            </Link>
            <span className="spacer" />
            <button
              type="button"
              className="icon"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play" : "Pause"}
              aria-pressed={paused}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1.2" />
                  <rect x="14" y="5" width="4" height="14" rx="1.2" />
                </svg>
              )}
            </button>
            <button type="button" className="skip" onClick={() => go(LAST)}>
              Skip
            </button>
          </div>
        </div>

        {/* ── The climbing timeline along the bottom ── */}
        <div className={`journey${stop >= 0 ? " on" : ""}`} style={vars({ "--p": frac })} aria-hidden="true">
          <span className="journey-fill" />
          {MILESTONES.map((name, z) => (
            <i
              key={name}
              className={z < stop ? "hit" : z === stop ? "now" : undefined}
              style={{ left: `${(z / (MILESTONES.length - 1)) * 100}%` }}
            />
          ))}
          {stop >= 0 && (
            <span
              className="journey-label"
              style={{
                left: `${frac * 100}%`,
                transform: stop === 0 ? "none" : stop === MILESTONES.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {MILESTONES[stop]}
            </span>
          )}
        </div>

        {/* ── 1. Who I am and what I'm asking ── */}
        <section key={key(0)} className={scene(0)} aria-label={SCREEN_LABELS[0]}>
          <div className="in">
            <div className="hello">
              <div className="ring">
                <div className="portrait">
                  <Image src="/gpt_image.png" alt="Shivansh Singh" fill preload sizes="120px" className="object-cover object-top" />
                </div>
              </div>
              <h1>
                <span>Shivansh</span>
                <span>Singh</span>
              </h1>
            </div>
            <h2 className="hl">I&apos;m applying for Amazon&apos;s SDE, Early Career 2027 role.</h2>
            <p className="sub">
              Here&apos;s what I&apos;ve worked on so far. It takes under a minute, and the referral
              details are on the last screen.
            </p>
            <p className="meta">Boston · Master&apos;s at Northeastern · graduating Dec 2026</p>
            <p className="hint" aria-hidden="true">
              <i />
              Tap for next
            </p>
          </div>
        </section>

        {/* ── 2. YouTube ── */}
        <section key={key(1)} className={scene(1)} aria-label={SCREEN_LABELS[1]}>
          <div className="in">
            <Principle>Learn and Be Curious</Principle>
            <h2 className="hl">Taught myself Flutter. Then taught everyone else.</h2>
            <div className="play" aria-hidden="true">
              {REACTIONS.map((f) => (
                <i key={f} style={vars({ "--f": f, "--fx": ((f * 37) % 21) - 10 })} />
              ))}
            </div>
            <p className="bign grad" aria-hidden="true">
              {count(12000, 900, 1400)}+
            </p>
            <p className="unit">subscribers</p>
            <div className="pills" aria-hidden="true">
              <span>1M views</span>
              <span>Started in the pandemic</span>
            </div>
            <p className="cap">Students used my tutorials for their assignments.</p>
          </div>
        </section>

        {/* ── 3. ExaWeather ── */}
        <section key={key(2)} className={scene(2)} aria-label={SCREEN_LABELS[2]}>
          <div className="in">
            <Principle>Deliver Results</Principle>
            <h2 className="hl">Built a weather app for a client.</h2>
            <div className="dots" aria-hidden="true">
              {DOWNLOAD_DOTS.map((i) => (
                <i key={i} style={vars({ "--i": i })} />
              ))}
            </div>
            <p className="bign grad" aria-hidden="true">
              {count(1000000, 750, 1450)}+
            </p>
            <p className="unit">Play Store downloads</p>
            <p className="foot">ExaWeather. The client retired it in 2025.</p>
          </div>
        </section>

        {/* ── 4. Travlog ── */}
        <section key={key(3)} className={scene(3)} aria-label={SCREEN_LABELS[3]}>
          <div className="in">
            <Principle>Ownership</Principle>
            <div className="swap">
              <h2 className="hl a">Built a startup&apos;s app from zero to launch.</h2>
              <h2 className="hl b" aria-hidden="true">
                Then fixed its silent push failures.
              </h2>
            </div>
            <div className="t-vis" aria-hidden="true">
              <div className="phone">
                <i className="u u1" />
                <i className="u u2" />
                <i className="u u3" />
                <i className="u u4" />
                {[0, 1, 2].map((q) => (
                  <span key={q} className="batch" style={vars({ "--q": q })}>
                    500 users
                  </span>
                ))}
              </div>
              <span className="launch">Launched</span>
              <svg className="spark" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path
                  pathLength="100"
                  d="M0 44 C 25 44, 35 24, 60 32 S 100 48, 125 30 S 165 12, 190 30 S 240 44, 262 26 S 290 18, 300 20"
                />
              </svg>
              <span className="dot" />
            </div>
            <p className="foot">Travlog, founding mobile engineer. Flutter and AWS.</p>
          </div>
        </section>

        {/* ── 5. FIA ── */}
        <section key={key(4)} className={scene(4)} aria-label={SCREEN_LABELS[4]}>
          <div className="in">
            <Principle>Hire and Develop the Best</Principle>
            <h2 className="hl">Led a 13-person team testing if AI can spot manipulation.</h2>
            <p className="sub">170 relationship scenarios from Reddit, run through GPT-4o, Claude and DeepSeek.</p>
            <ul className="results" aria-hidden="true">
              <li className="good" style={vars({ "--w": 0.76, "--row": 0 })}>
                <span className="rk">Flagging a clearly dangerous situation</span>
                <span className="rbar">
                  <i />
                </span>
                <span className="rv">7.6/10</span>
              </li>
              <li className="bad" style={vars({ "--w": 0.19, "--row": 1 })}>
                <span className="rk">Naming which kind of manipulation</span>
                <span className="rbar">
                  <i />
                </span>
                <span className="rv">19%</span>
              </li>
            </ul>
            <p className="cap">AI can tell something is wrong. It can&apos;t tell you what kind.</p>
          </div>
        </section>

        {/* ── 6. Hackathon ── */}
        <section key={key(5)} className={scene(5)} aria-label={SCREEN_LABELS[5]}>
          <div className="in">
            <Principle>Invent and Simplify</Principle>
            <h2 className="hl">Won a Google Cloud hackathon.</h2>
            <p className="sub">git-to-doc checks if an AI-written commit message matches the code.</p>
            <div className="diffs" aria-hidden="true">
              <div className="card c1">
                <span className="k">AI commit message</span>
                <code>fix: typo in README</code>
              </div>
              <div className="card c2">
                <span className="k">Actual diff</span>
                <code>
                  <span className="del">- if (!user) return null</span>
                  <br />
                  <span className="add">+ verifyToken(req.headers)</span>
                </code>
                <span className="scanv" />
                <span className="verdict">✕ Doesn&apos;t match</span>
              </div>
            </div>
            <figure className="win">
              <Image
                src="/git-to-doc/me_showing_demo.jpg"
                alt="Demoing git-to-doc to a judge at the hackathon"
                fill
                sizes="(max-width: 600px) 84vw, 360px"
                className="object-cover"
              />
              <figcaption>
                <b>1st</b>
                <span>GDG Cloud Boston × Northeastern · June 2026</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 7. lurq ── */}
        <section key={key(6)} className={scene(6)} aria-label={SCREEN_LABELS[6]}>
          <div className="in">
            <Principle>Dive Deep</Principle>
            <h2 className="hl">Then I built lurq.</h2>
            <p className="sub">
              AI coding agents install packages from memory, so they often pick old or made-up
              versions. lurq is a live index they check first.
            </p>
            <p className="k checks-k">Before each install, it checks</p>
            <div className="pills" aria-hidden="true">
              {LURQ_CHECKS.map((c, n) => (
                <span key={c} style={vars({ "--n": n })}>
                  {c}
                </span>
              ))}
            </div>
            <div className="gate" aria-hidden="true">
              <span className="src">AI agent</span>
              <div className="flow">
                {PACKETS.map((t, n) => (
                  <i
                    key={n}
                    className={`pk ${t}`}
                    style={vars({ "--d": `${(n * 0.36).toFixed(2)}s`, "--x": n % 4 < 2 ? -1 : 1 })}
                  />
                ))}
              </div>
              <span className="bar">
                <b>lurq</b>
              </span>
              <span className="dst">your project</span>
            </div>
            <p className="foot">In one test, my agent picked 34 versions. 33 were out of date.</p>
          </div>
        </section>

        {/* ── 8. Next: Amazon? The referral kit ── */}
        <section key={key(7)} className={scene(7)} aria-label={SCREEN_LABELS[7]}>
          <div className="in">
            <h2 className="ask grad">Next: Amazon?</h2>
            <p className="sub">{JOB_TITLE}</p>
            <ul className="kit">
              <li>
                <span className="kv">
                  <span className="k">Job ID</span>
                  <span className="v id">{JOB_ID}</span>
                </span>
                <button type="button" className="chip primary" onClick={() => copy("id", JOB_ID)}>
                  {copied === "id" ? "Copied" : "Copy"}
                </button>
              </li>
              <li>
                <span className="kv">
                  <span className="k">Email</span>
                  <span className="v">{EMAIL}</span>
                </span>
                <button type="button" className="chip" onClick={() => copy("email", EMAIL)}>
                  {copied === "email" ? "Copied" : "Copy"}
                </button>
              </li>
              {hasResume && (
                <li>
                  <span className="kv">
                    <span className="k">Resume</span>
                    <span className="v">PDF</span>
                  </span>
                  <a className="chip" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </li>
              )}
              <li>
                <span className="kv">
                  <span className="k">Note</span>
                  <span className="v">A few lines for the form</span>
                </span>
                <button type="button" className="chip" onClick={() => copy("note", NOTE)}>
                  {copied === "note" ? "Copied" : "Copy"}
                </button>
              </li>
            </ul>
            {fallback && (
              <>
                <p className="k fallback-k">Couldn&apos;t copy. Press and hold the text below.</p>
                <textarea ref={boxRef} className="copybox" readOnly value={fallback} aria-label="Text to copy" />
              </>
            )}
            <p className="links">
              <a href={JOB_URL} target="_blank" rel="noopener noreferrer">
                Job posting ↗
              </a>
              <Link href="/">shivanshsingh.in</Link>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </p>
            <div className="end">
              <span>Boston · available from Dec 2026</span>
              <button type="button" className="again" onClick={() => go(0, true)}>
                Watch again
              </button>
            </div>
          </div>
        </section>

        <p className="sr-only" aria-live="polite">
          {copied ? "Copied" : SCREEN_LABELS[nav.cur]}
        </p>
        <p className="rm-hint" aria-hidden="true">
          Tap for next
        </p>
      </section>

      <p className="kbd" aria-hidden="true">
        Tap, or use ← → · Space pauses
      </p>
    </div>
  );
}
