"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md mx-auto text-center">
        {/* 404 */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
          404
        </h1>

        {/* Message */}
        <p className="text-base sm:text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>

        {/* Action */}
        <Button size="lg" asChild>
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
