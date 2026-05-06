"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface BlogViewTrackerProps {
  slug: string;
  title: string;
}

export default function BlogViewTracker({ slug, title }: BlogViewTrackerProps) {
  useEffect(() => {
    trackEvent("blog_post_view", { slug, title });
  }, [slug, title]);

  return null;
}
