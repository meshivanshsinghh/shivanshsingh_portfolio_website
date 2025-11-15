"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Instagram, Send } from "lucide-react";

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <footer className="relative border-t border-border/50">
      <div className="container max-w-7xl mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                LET'S <span className="text-primary">CONNECT</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Say hello at{" "}
                <a
                  href="mailto:shivansh@example.com"
                  className="text-primary hover:underline"
                >
                  shivansh@example.com
                </a>
              </p>
              <p className="text-muted-foreground">
                For more info, here's my{" "}
                <a
                  href="/resume.pdf"
                  className="text-primary hover:underline font-medium"
                >
                  resume
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Shivansh Singh. All rights
                reserved.
              </p>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Let's work together!"
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full group">
                <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
