import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import BlogViewTracker from "@/components/blog-view-tracker";

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogViewTracker slug={slug} title={post.title} />
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        All posts
      </Link>

      <article className="max-w-3xl">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground border border-border rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title & meta */}
        <h1 className="text-2xl font-semibold text-foreground leading-snug mb-4">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {post.description}
          </p>
        )}
        <div className="flex items-center gap-5 text-xs text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {publishedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            5 min read
          </span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-video rounded border border-border overflow-hidden mb-10">
            <Image
              src={urlFor(post.coverImage).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm prose-neutral max-w-none text-foreground
          prose-headings:font-semibold prose-headings:text-foreground
          prose-a:text-[#cc0000] prose-a:no-underline hover:prose-a:underline
          prose-code:text-foreground prose-code:bg-secondary prose-code:px-1 prose-code:rounded
          prose-pre:bg-secondary prose-pre:border prose-pre:border-border
          prose-blockquote:border-l-[#cc0000] prose-blockquote:text-muted-foreground">
          <PortableText value={post.body} />
        </div>

        {/* Author */}
        {post.author && (
          <div className="mt-12 pt-8 border-t border-border flex items-center gap-4">
            {post.author.image && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border">
                <Image
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Written by</p>
              <p className="text-sm font-medium text-foreground">{post.author.name}</p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
