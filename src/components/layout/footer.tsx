import Link from "next/link";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/meshivanshsinghh",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/shivanshsinghh",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: "https://x.com/shivanshneu",
    icon: Twitter,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@BackslashFlutter",
    icon: Youtube,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Shivansh Singh
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
