import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
