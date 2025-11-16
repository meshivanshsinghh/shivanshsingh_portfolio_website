import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, BookOpen, Clock } from "lucide-react";
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
    <section className="py-32">
      <div className="container max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-4">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blog</span>
          </div>
          <div className="flex items-end justify-between gap-8">
            <h2 className="text-4xl md:text-4xl font-bold tracking-tight">
              Latest <span className="text-primary">Writings</span>
            </h2>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground group transition-colors"
            >
              View all posts
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                imageUrl = urlFor(post.coverImage)
                  .width(600)
                  .height(400)
                  .url();
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
                <article className="h-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-card/50 transition-all duration-300">
                  {/* Cover Image */}
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 min read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-primary/20 text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 md:hidden text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}