"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#080808]/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 flex h-14 items-center justify-between">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#cc0000] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
            SS
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            CV
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-[#0d0d0d]">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-1 transition-colors ${
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm py-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              CV
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
