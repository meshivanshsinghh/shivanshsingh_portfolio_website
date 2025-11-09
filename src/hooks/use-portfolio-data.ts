"use client";

import { useEffect, useState } from "react";
import { SanityData } from "@/types/sanity";
import { getCachedData, setCachedData } from "@/lib/sanity-service";

export function usePortfolioData(initialData?: SanityData) {
  const [data, setData] = useState<SanityData>(
    initialData || { projects: [], blogPosts: [] }
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    // If no cache and no initial data, fetch from API
    if (!initialData) {
      fetchData();
    }
  }, [initialData]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/portfolio");
      if (!response.ok) throw new Error("Failed to fetch");
      
      const newData = await response.json();
      setData(newData);
      setCachedData(newData); // Cache the data
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, isLoading, error, refetch: fetchData };
}