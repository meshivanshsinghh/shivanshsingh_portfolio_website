"use client";

import { useEffect, useState } from "react";

export default function BlogProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#cc0000] transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
