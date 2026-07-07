import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/client-layout";
import Analytics from "@/components/analytics";
import ThemeProvider from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shivanshsingh.in"),
  title: {
    default: "Shivansh Singh",
    template: "%s | Shivansh Singh",
  },
  description:
    "Software engineer and analytics student at Northeastern University, building ML systems and cloud infrastructure.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shivanshsingh.in",
    siteName: "Shivansh Singh",
    title: "Shivansh Singh",
    description:
      "Software engineer and analytics student at Northeastern University, building ML systems and cloud infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@shivanshneu",
    creator: "@shivanshneu",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC prevention: apply dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Default to dark unless the visitor has explicitly chosen light.
                  var theme = localStorage.getItem('theme');
                  if (theme !== 'light') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Analytics />
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
