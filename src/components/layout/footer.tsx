"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t border-border/50">
      <div className="container max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-4 py-20 relative">
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
                  href="mailto:singh.shivan@northeastern.edu"
                  className="text-primary hover:underline"
                >
                  singh.shivan@northeastern.edu
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
                href="https://linkedin.com/in/shivanshsinghh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/meshivanshsinghh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/shivanshneu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/shivanshsinghh_/"
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

              <Button
                type="submit"
                size="lg"
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </>
                )}
              </Button>

              {/* Success/Error Messages */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    Message sent successfully! I'll get back to you soon.
                  </span>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    Failed to send message. Please try again or email me
                    directly.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
