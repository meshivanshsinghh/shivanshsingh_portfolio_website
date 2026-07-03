"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(result.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start justify-center h-full gap-3 py-8">
        <CheckCircle className="h-8 w-8 text-accent" />
        <p className="text-foreground font-semibold">Message sent.</p>
        <p className="text-sm text-text-dim">I&apos;ll get back to you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          name="name"
          required
          placeholder="Name"
          className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What are you working on?"
        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/85 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        <Send className="h-3.5 w-3.5" />
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-xs text-accent">{errorMsg}</p>
      )}
    </form>
  );
}
