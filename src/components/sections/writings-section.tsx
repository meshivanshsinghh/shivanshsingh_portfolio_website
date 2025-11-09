import Link from "next/link";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SanityBlogPost } from "@/types/sanity";
import { blogPosts as fallbackPosts, BlogPost } from "@/data/blog-posts";

interface WritingsSectionProps {
  blogPosts?: SanityBlogPost[];
}

export default function WritingsSection({ blogPosts }: WritingsSectionProps) {
  // Use Sanity data if available, otherwise use fallback
  const postsToShow: (SanityBlogPost | BlogPost)[] = blogPosts && blogPosts.length > 0
    ? blogPosts.slice(0, 2)
    : fallbackPosts.slice(0, 2);

  return (
    <section className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Writings</h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="text-muted-foreground mb-8">
        I write about web development, programming, and software engineering. Here are some of my recent blog posts.
      </p>

      <div className="space-y-6">
        {postsToShow.map((post, index) => {
          // Type guard to check if it's a SanityBlogPost
          const isSanityPost = (post: SanityBlogPost | BlogPost): post is SanityBlogPost => {
            return 'slug' in post && typeof post.slug === 'object' && 'current' in post.slug;
          };

          const slug = isSanityPost(post) ? post.slug.current : post.slug;
          const date = isSanityPost(post)
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : post.date;

          return (
            <Link
              key={isSanityPost(post) ? post._id : index}
              href={`/blog/${slug}`}
              className="block group"
            >
              <article className="space-y-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground">{post.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {date}
                  </span>
                  {post.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}