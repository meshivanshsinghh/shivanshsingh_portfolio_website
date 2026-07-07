import { Metadata } from "next";

// Posts live on Medium, so /blog is a directory of outbound links.
// No individual post pages ship from this site.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
