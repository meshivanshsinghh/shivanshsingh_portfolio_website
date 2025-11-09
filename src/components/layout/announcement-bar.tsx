import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SanityAnnouncement } from "@/types/sanity";

interface AnnouncementBarProps {
  announcement: SanityAnnouncement;
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  if (!announcement?.isActive) return null;

  const variantStyles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
    warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900",
  };

  const textStyles = {
    info: "text-blue-900 dark:text-blue-100",
    success: "text-green-900 dark:text-green-100",
    warning: "text-yellow-900 dark:text-yellow-100",
  };

  const linkStyles = {
    info: "text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200",
    success: "text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200",
    warning: "text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200",
  };

  return (
    <div className={`border-b ${variantStyles[announcement.variant]}`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 py-3 text-sm">
          <p className={`${textStyles[announcement.variant]} font-medium`}>
            {announcement.text}
          </p>
          {announcement.link && announcement.linkText && (
            <Link
              href={announcement.link}
              className={`flex items-center gap-1 font-semibold ${linkStyles[announcement.variant]} transition-colors`}
            >
              {announcement.linkText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}