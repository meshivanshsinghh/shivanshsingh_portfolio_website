"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, no-op
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-accent select-none shrink-0">$</span>
        <span className="text-foreground truncate">{command}</span>
      </div>
      <button
        onClick={copy}
        aria-label="Copy install command"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
