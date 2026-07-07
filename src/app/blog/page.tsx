import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getMediumPosts } from "@/lib/medium";
import BlogFilter from "./blog-filter";

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getMediumPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Writing</h1>
            <p className="text-sm text-muted-foreground">
              Thoughts on ML systems, software engineering, and applied research.
            </p>
          </div>
          <a
            href="https://medium.com/@me.shivansh007"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            View on Medium
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t reach Medium right now. Try again shortly, or{" "}
            <a
              href="https://medium.com/@me.shivansh007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              read on Medium
            </a>
            .
          </p>
        </div>
      ) : (
        <BlogFilter posts={posts} />
      )}
    </div>
  );
}
