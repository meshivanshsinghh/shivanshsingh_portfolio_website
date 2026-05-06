"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const ACCESS_KEY = process.env.WEB3FORMS_KEY ?? "";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", "Portfolio Contact - " + formData.get("name"));
    formData.append("from_name", "shivanshsingh.in");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start justify-center h-full gap-3 py-8">
        <CheckCircle className="h-8 w-8 text-[#cc0000]" />
        <p className="text-white font-semibold">Message sent.</p>
        <p className="text-sm text-[#999]">I&apos;ll get back to you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-[#666] hover:text-white transition-colors mt-2"
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
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What are you working on?"
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#aa0000] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        <Send className="h-3.5 w-3.5" />
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-xs text-[#cc0000]">Something went wrong. Try emailing me directly.</p>
      )}
    </form>
  );
}
