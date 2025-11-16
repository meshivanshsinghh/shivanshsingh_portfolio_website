"use client";

import { Github, Linkedin, Twitter, Instagram } from "lucide-react";


const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/meshivanshsinghh",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/shivanshsinghh",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    url: "https://x.com/shivanshneu",
    icon: Twitter,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/shivanshsinghh_/",
    icon: Instagram,
  },
];

export default function SocialSidebar() {
  return (
    <>
      {/* Desktop - Left Side - Social Icons */}
      <div className="hidden xl:fixed xl:flex xl:flex-col xl:gap-6 xl:left-8 xl:bottom-0 xl:z-40">
        <div className="flex flex-col gap-5 items-center">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all hover:scale-110 hover:-translate-y-1"
                aria-label={social.name}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
        {/* Vertical line */}
        <div className="w-[2px] h-24 bg-border/50 mx-auto" />
      </div>

      {/* Desktop - Right Side - Email */}
      <div className="hidden xl:fixed xl:flex xl:flex-col xl:gap-6 xl:right-8 xl:bottom-0 xl:z-40">
        <a
          href="mailto:singh.shiva@northeastern.edu"
          className="text-muted-foreground hover:text-primary transition-all hover:-translate-y-1"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          <span className="text-sm tracking-wider font-mono">
            singh.shiva@northeastern.edu
          </span>
        </a>
        {/* Vertical line */}
        <div className="w-[2px] h-24 bg-border/50 mx-auto" />
      </div>
    </>
  );
}
