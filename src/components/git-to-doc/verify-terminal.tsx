// Real transcript of `git-to-doc verify` against google-deepmind/gemma PR #224.
// Rendered as an always-dark terminal pane so it reads like the actual tool in
// both site themes. Shortened for readability, exact wording preserved.

const MSG_SUBJECT = "docs: Add GPU memory requirements table (Fixes #167)";
const MSG_TAGLINE = "Adds detailed GPU memory requirements table to README.md to help users select appropriate hardware configurations.";

const HEADLINE_DIVERGENCE = {
  text: "The commit message claims to add a GPU memory requirements table to README.md, but no changes were made to any README file in the diff.",
  ref: "README.md:1",
  by: "qwen2.5-coder:14b",
};

const REMAINING_DIVERGENCES = 3;

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
          <span className="text-neutral-100 break-all">
            git-to-doc verify --url .../gemma/pull/224
          </span>
        </div>

        <div className="h-3" />

        {/* progress lines */}
        <div className="text-neutral-400">{"  "}🔎 auditing google-deepmind/gemma#224 with 2 model(s)…</div>
        <div className="text-neutral-400">{"     "}Auditors: qwen2.5-coder:14b, deepseek-coder-v2:latest (2 independent, cross-family)</div>

        <div className="h-3" />

        {/* original message: subject + one-line tagline (was 20+ lines) */}
        <div className="text-neutral-500 font-semibold tracking-wide">{"  "}ORIGINAL MESSAGE</div>
        <div className="text-neutral-300">{"  "}{MSG_SUBJECT}</div>
        <div className="text-neutral-500">{"  "}{MSG_TAGLINE}</div>

        <div className="h-3" />

        {/* verdict */}
        <div className="text-emerald-400">{"  "}✅ Original message matches the diff. Auditors found no material omissions.</div>

        <div className="h-3" />

        {/* one representative divergence */}
        <div className="text-amber-400">{"  "}⚡ 4 POSSIBLE divergences (only one auditor flagged)</div>
        <div className="pl-3 mt-1">
          <div className="text-neutral-200">
            <span className="text-amber-400">{"• "}</span>
            {HEADLINE_DIVERGENCE.text}
          </div>
          <div className="text-red-400 pl-4">{HEADLINE_DIVERGENCE.ref}</div>
          <div className="text-neutral-500 italic pl-4">
            (flagged by {HEADLINE_DIVERGENCE.by}; verify manually)
          </div>
        </div>
        <div className="text-neutral-500 pl-3 mt-1">{"  "}+ {REMAINING_DIVERGENCES} more possible divergences</div>

        <div className="h-3" />

        {/* benchmark footer */}
        <div className="text-neutral-400">{"  "}📊 Benchmark: 69% precision, 36% recall (synthetic n=168, 16GB tier)</div>
      </div>
    </div>
  );
}
