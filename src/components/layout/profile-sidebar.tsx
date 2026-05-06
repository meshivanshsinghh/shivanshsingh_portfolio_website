import Image from "next/image";
import { Github, Linkedin, Twitter, Youtube, Mail, MapPin, FileText } from "lucide-react";
import { getChannelStats } from "@/lib/youtube-channel";

const socials = [
  { name: "GitHub", href: "https://github.com/meshivanshsinghh", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/shivanshsinghh", icon: Linkedin },
  { name: "Twitter / X", href: "https://x.com/shivanshneu", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@BackslashFlutter", icon: Youtube },
];

export default async function ProfileSidebar() {
  const ytStats = await getChannelStats();
  const subs = ytStats?.subs ?? "13K";
  const views = ytStats?.views ?? "1M+";

  return (
    <aside className="w-full md:w-56 lg:w-64 shrink-0 self-start md:sticky md:top-[5.5rem]">
      <div className="space-y-5">

        {/* Photo — circular */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border relative">
          <Image
            src="/profile.jpg"
            alt="Shivansh Singh"
            fill
            className="object-cover object-top"
            sizes="96px"
            priority
          />
        </div>

        {/* Name & role */}
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground leading-tight">
            Shivansh Singh
          </h1>
          <p className="text-sm text-muted-foreground leading-snug">
            Software Engineer &amp; ML Researcher
          </p>
        </div>

        {/* Affiliation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#cc0000] shrink-0" />
            <span className="text-foreground font-medium">Northeastern University</span>
          </div>
          <p className="text-xs text-muted-foreground pl-3">
            M.S. Analytics, Apr 2025 - Dec 2026
          </p>
          <div className="flex items-center gap-1.5 text-xs pl-3 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            Boston, MA
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Contact */}
        <div className="space-y-2">
          <a
            href="mailto:singh.shivan@northeastern.edu"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate group-hover:underline underline-offset-2">
              singh.shivan@northeastern.edu
            </span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="group-hover:underline underline-offset-2">CV / Resume</span>
          </a>
        </div>

        {/* Social links */}
        <div className="flex flex-row md:flex-col gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
            >
              <s.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline group-hover:underline underline-offset-2">
                {s.name}
              </span>
            </a>
          ))}
        </div>

        {/* YouTube stats — live cached */}
        <div className="hidden md:flex flex-col gap-0.5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">Building in AI/ML on YouTube</p>
          <p className="text-xs font-semibold text-foreground">
            {subs} subscribers · {views} views
          </p>
        </div>

      </div>
    </aside>
  );
}
