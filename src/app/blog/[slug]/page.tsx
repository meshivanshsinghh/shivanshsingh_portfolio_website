import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  publishedAt,
  tags,
  coverImage,
  body,
  author->{
    name,
    image
  }
}`;

async function getPost(slug: string) {
    const post = await client.fetch(POST_QUERY, { slug });
    return post;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center max-w-4xl mx-auto px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <article className="py-20">
                <div className="container max-w-4xl mx-auto px-4">
                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags?.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-sm bg-primary/10 text-primary border-primary/20"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {post.title}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-6">
                            {post.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {publishedDate}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                5 min read
                            </span>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40 shadow-2xl mb-12">
                            <Image
                                src={urlFor(post.coverImage).width(1200).height(675).url()}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
                        <PortableText value={post.body} />
                    </div>

                    {/* Author */}
                    {post.author && (
                        <div className="mt-16 pt-8 border-t border-border/40">
                            <div className="flex items-center gap-4">
                                {post.author.image && (
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                        <Image
                                            src={urlFor(post.author.image).width(64).height(64).url()}
                                            alt={post.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Written by</p>
                                    <p className="font-semibold">{post.author.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}