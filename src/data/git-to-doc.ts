import type { SanityProject } from "@/types/sanity";

// Shared constant for git-to-doc so /projects and homepage Experiments show
// the same info without drifting. Unlike other projects it has its own
// bespoke landing page, so `href` routes there instead of /projects/[slug].
export const GIT_TO_DOC: SanityProject & {
  headline: string;
  techStack: string[];
  award?: string;
  href: string;
  image: string;
} = {
  _id: "git_to_doc",
  _createdAt: "2026-06-01T00:00:00.000Z",
  title: "git-to-doc",
  slug: { current: "git-to-doc" },
  description:
    "An audit layer for AI-generated commits. Two different-family models read a diff independently and flag where the commit message doesn't match the code.",
  date: "Jun 2026",
  tags: ["LLM", "Developer Tools", "Evaluation"],
  featured: true,
  link: "https://pypi.org/project/git-to-doc/",
  headline:
    "Audits AI-generated commits by reading the diff with two different-family models and flagging where the message doesn't match the code",
  techStack: ["Python", "Ollama", "qwen2.5-coder", "deepseek-coder-v2", "Pydantic"],
  award: "1st · GDG Cloud Boston × Northeastern",
  href: "/git-to-doc",
  image: "/git-to-doc/our_product.png",
};
