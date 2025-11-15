import Hero from "@/components/sections/hero";
import SkillsSection from "@/components/sections/skills-section";
import ExperienceSection from "@/components/sections/experience-section";
import YoutubeSection from "@/components/sections/youtube-section"; // NEW
import WorkSection from "@/components/sections/work-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import { fetchPortfolioData } from "@/lib/sanity-service";
import WritingsSection from "@/components/sections/writings-section";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const portfolioData = await fetchPortfolioData();

  return (
    <div className="relative">
      {/* Hero with announcement */}
      <Hero announcement={portfolioData.announcement} />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <SkillsSection />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <ExperienceSection />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      {/* NEW: YouTube Teaching Journey */}
      <YoutubeSection />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      {/* Pass Sanity projects data */}
      <WorkSection projects={portfolioData.projects} />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      {/* Pass Sanity blog posts data */}
      <WritingsSection blogPosts={portfolioData.blogPosts} />
      
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <TestimonialsSection />
    </div>
  );
}