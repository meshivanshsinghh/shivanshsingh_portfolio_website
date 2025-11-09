import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SanityBlogPost } from "@/types/sanity";
import { blogPosts as fallbackPosts, BlogPost } from "@/data/blog-posts";
import { urlFor } from "@/lib/sanity";

interface WritingsSectionProps {
  blogPosts?: SanityBlogPost[];
}

export default function WritingsSection({ blogPosts }: WritingsSectionProps) {
  const postsToShow: (SanityBlogPost | BlogPost)[] =
    blogPosts && blogPosts.length > 0
      ? blogPosts.slice(0, 3)
      : fallbackPosts.slice(0, 3);

  return (
    <section className="container max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Latest Writings</h2>
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <p className="text-muted-foreground mb-12 text-lg">
        Thoughts on software engineering, AI/ML, and technology.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postsToShow.map((post, index) => {
          const isSanityPost = (
            post: SanityBlogPost | BlogPost
          ): post is SanityBlogPost => {
            return (
              "slug" in post &&
              typeof post.slug === "object" &&
              "current" in post.slug
            );
          };

          const slug = isSanityPost(post) ? post.slug.current : post.slug;
          const date = isSanityPost(post)
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : post.date;

          const hasImage = isSanityPost(post) && post.coverImage?.asset;
          let imageUrl: string | null = null;

          if (hasImage && post.coverImage) {
            try {
              imageUrl = urlFor(post.coverImage).width(600).height(400).url();
            } catch (error) {
              console.error("Error generating image URL:", error);
            }
          }

          return (
            <Link
              key={isSanityPost(post) ? post._id : index}
              href={`/blog/${slug}`}
              className="group block"
            >
              <article className="h-full border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-card hover:border-primary/50">
                {/* Cover Image */}
                {imageUrl && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{date}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
