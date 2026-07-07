"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // On mount, honor a stored choice; otherwise default to dark.
  // Reading persisted theme is client-only, so it has to sync into state here.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage is unavailable during SSR; theme must be resolved on mount */
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      // Default to dark
      setTheme("dark");
    }
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Sync the .dark class on <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Add transition class for smooth theme switching
    root.classList.add("theme-transition");

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350);

    return () => clearTimeout(timer);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
