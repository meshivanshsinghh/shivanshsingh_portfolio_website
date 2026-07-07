// Real transcript of `git-to-doc verify` against google-deepmind/gemma PR #224.
// Rendered as an always-dark terminal pane so it reads like the actual tool in
// both site themes. Verbatim output — the wording is the tool's, not edited.

const MSG_SUBJECT = "docs: Add GPU memory requirements table (Fixes #167)";

const MSG_BODY: string[] = [
  "",
  "## Description",
  "Adds detailed GPU memory requirements table to README.md to help users",
  "select appropriate hardware configurations (Addresses Issue #167).",
  "",
  "### Changes",
  "- Added comprehensive VRAM specifications for:",
  "  - Gemma 2B, 7B, and 12B model variants",
  "  - Both bf16 and int4 quantizations",
  "- Included:",
  "  - Minimum required VRAM",
  "  - Recommended VRAM for optimal performance",
  "  - Notes about framework overhead",
  "",
  "### Impact",
  "- Helps users avoid OOM errors by selecting compatible hardware",
  "- Provides clear guidance for different model sizes and precisions",
  "- Complements existing system requirements documentation",
  "",
  "Fixes #167",
];

const DIVERGENCES: { text: string; ref: string; by: string }[] = [
  {
    text: "The diff introduces new CI/CD workflows and configuration files that define how the project will be tested, packaged, and published on GitHub Actions.",
    ref: ".github/workflows/pytest_and_autopublish.yml:1",
    by: "deepseek-coder-v2:latest",
  },
  {
    text: "The diff includes a new `.gitignore` file to manage which files should be ignored by version control.",
    ref: ".gitignore:1",
    by: "deepseek-coder-v2:latest",
  },
  {
    text: "The diff adds a new configuration file `.pylintrc` for configuring pylint, a Python linting tool.",
    ref: ".pylintrc:1",
    by: "deepseek-coder-v2:latest",
  },
  {
    text: "The commit message claims to add a GPU memory requirements table to README.md, but no changes were made to any README file in the diff.",
    ref: "README.md:1",
    by: "qwen2.5-coder:14b",
  },
];

export default function VerifyTerminal() {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161617] border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[11px] font-mono text-neutral-400 ml-2 truncate">
          ~/Professional/git-to-doc
        </span>
      </div>

      {/* Body */}
      <div className="bg-[#0b0b0c] text-[#d4d4d4] p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap break-words">
        {/* prompt + command */}
        <div>
          <span className="text-emerald-400">(venv)</span>{" "}
          <span className="text-sky-400">~/Professional/git-to-doc</span>{" "}
          <span className="text-emerald-400">❯</span>{" "}
          <span className="text-neutral-100">
            git-to-doc verify --url https://github.com/google-deepmind/gemma/pull/224
          </span>
        </div>

        <div className="h-3" />

        {/* progress lines */}
        <div className="text-neutral-400">{"  "}🔎 auditing https://github.com/google-deepmind/gemma/pull/224 with 2 model(s) — this can take a moment…</div>
        <div className="text-neutral-500">{"  "}↓ https://patch-diff.githubusercontent.com/raw/google-deepmind/gemma/pull/224.diff</div>
        <div className="text-neutral-300">{"  "}🔍 Verifying commit https://github.com/google-deepmind/gemma/pull/224</div>
        <div className="text-neutral-400">{"     "}Auditors: qwen2.5-coder:14b, deepseek-coder-v2:latest (2 independent, cross-family)</div>

        <div className="h-3" />

        {/* original message (dimmed so the findings stand out) */}
        <div className="text-neutral-500 font-semibold tracking-wide">{"  "}ORIGINAL MESSAGE</div>
        <div className="text-neutral-300">{"  "}{MSG_SUBJECT}</div>
        {MSG_BODY.map((line, i) => (
          <div key={i} className="text-neutral-500">{line ? "  " + line : " "}</div>
        ))}

        <div className="h-3" />

        {/* verdict */}
        <div className="text-emerald-400">{"  "}✅ Original message matches the diff. Auditors found no material omissions.</div>

        <div className="h-3" />

        {/* possible divergences */}
        <div className="text-amber-400">{"  "}⚡ 4 POSSIBLE divergences (only one auditor flagged)</div>
        {DIVERGENCES.map((d, i) => (
          <div key={i} className="pl-3">
            <div className="text-neutral-200">
              <span className="text-amber-400">{"• "}</span>
              {d.text}
            </div>
            <div className="text-red-400 pl-4">{d.ref}</div>
            <div className="text-neutral-500 italic pl-4">
              (flagged by {d.by}, others did not; verify manually)
            </div>
          </div>
        ))}

        <div className="h-3" />

        {/* benchmark footer */}
        <div className="text-neutral-400">{"  "}📊 Benchmark: 69% precision, 36% recall (synthetic n=168, 16GB tier, see BENCHMARKS.md)</div>
      </div>
    </div>
  );
}
