import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from "lucide-react";
import BlogViewTracker from "@/components/blog-view-tracker";
import BlogShare from "@/components/blog-share";
import BlogProgress from "@/components/blog-progress";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  publishedAt,
  tags,
  seoTitle,
  readingTime,
  coverImage,
  body,
  author->{
    name,
    image
  }
}`;

async function getPost(slug: string) {
  try {
    return await client.fetch(POST_QUERY, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  let coverImageUrl: string | undefined;
  if (post.coverImage?.asset) {
    try {
      coverImageUrl = urlFor(post.coverImage).width(1200).height(630).url();
    } catch {
      coverImageUrl = undefined;
    }
  }

  return {
    title,
    description: post.description,
    // Explicitly override the blog layout's noindex so individual posts ARE indexed.
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Shivansh Singh"],
      ...(coverImageUrl && {
        images: [{ url: coverImageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      ...(coverImageUrl && { images: [coverImageUrl] }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let coverImageUrl: string | undefined;
  if (post.coverImage?.asset) {
    try {
      coverImageUrl = urlFor(post.coverImage).width(1200).height(630).url();
    } catch {
      coverImageUrl = undefined;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? "",
    author: { "@type": "Person", name: "Shivansh Singh", url: "https://shivanshsingh.in" },
    datePublished: post.publishedAt,
    ...(coverImageUrl && { image: coverImageUrl }),
    url: `https://shivanshsingh.in/blog/${slug}`,
    publisher: {
      "@type": "Person",
      name: "Shivansh Singh",
      url: "https://shivanshsingh.in",
    },
  };

  const readingTime = post.readingTime ?? 5;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogProgress />
      <BlogViewTracker slug={slug} title={post.title} />

      {/* Top nav: back + share */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All posts
        </Link>
        <BlogShare title={post.title} slug={slug} />
      </div>

      <article className="max-w-2xl">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded hover:border-foreground hover:text-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {post.description}
          </p>
        )}

        {/* Meta bar */}
        <div className="flex items-center justify-between gap-4 py-4 border-y border-border mb-10">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Shivansh Singh</span>
          </div>
        </div>

        {/* Cover image */}
        {coverImageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-10 border border-border">
            <Image
              src={coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body */}
        <div className="prose prose-neutral max-w-none
          prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[15px] prose-p:text-foreground prose-p:leading-[1.8]
          prose-a:text-[#cc0000] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-foreground
          prose-code:text-[13px] prose-code:text-foreground prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0f0f0f] prose-pre:text-[#e5e5e5] prose-pre:rounded-lg prose-pre:border prose-pre:border-[#222] prose-pre:text-[13px]
          prose-blockquote:border-l-[3px] prose-blockquote:border-[#cc0000] prose-blockquote:bg-[#fff5f5] prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-r prose-blockquote:text-foreground prose-blockquote:not-italic
          prose-ul:my-4 prose-li:my-1
          prose-img:rounded-lg prose-img:border prose-img:border-border
          prose-hr:border-border">
          <PortableText value={post.body} />
        </div>

        {/* Bottom: author + share */}
        <div className="mt-14 pt-8 border-t border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Author card */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border shrink-0">
                <Image
                  src="/profile.jpg"
                  alt="Shivansh Singh"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Shivansh Singh</p>
                <a
                  href="https://x.com/shivanshneu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-[#cc0000] transition-colors flex items-center gap-1"
                >
                  @shivanshneu <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
            <BlogShare title={post.title} slug={slug} />
          </div>

          {/* Back to blog */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
