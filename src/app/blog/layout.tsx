import { Metadata } from "next";

// The /blog listing page should not appear in search results - only
// individual posts (/blog/[slug]) should. Each post page overrides
// this with robots: { index: true } in its own generateMetadata.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
