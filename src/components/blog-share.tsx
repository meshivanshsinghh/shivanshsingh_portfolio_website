"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";

interface BlogShareProps {
  title: string;
  slug: string;
}

export default function BlogShare({ title, slug }: BlogShareProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://shivanshsingh.in/blog/${slug}`;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=shivanshneu`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
