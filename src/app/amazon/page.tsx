import type { Metadata } from "next";
import { existsSync } from "fs";
import path from "path";
import ReferralStory from "./referral-story";

// Shared on LinkedIn, so the preview card leads with the name, not "Amazon",
// and never uses Amazon's logo. The preview image is opengraph-image.tsx.
const TITLE = "Shivansh Singh · Amazon SDE, Early Career 2027";
const DESCRIPTION =
  "A one-minute look at my work, then the job ID, resume and a short note for the referral form.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shivanshsingh.in/amazon",
    siteName: "Shivansh Singh",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: false, follow: true },
};

export default function AmazonReferralPage() {
  // The resume row only shows once public/resume.pdf exists, same as the About photos.
  const hasResume = existsSync(path.join(process.cwd(), "public", "resume.pdf"));
  return <ReferralStory hasResume={hasResume} />;
}
