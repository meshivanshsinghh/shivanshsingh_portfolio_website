import { AnimatedHero } from "@/components/sections/animated-hero";
import SkillsSection from "@/components/sections/skills-section";
import ExperienceEducationSection from "@/components/sections/experience-education-section";
import WorkSection from "@/components/sections/work-section-new";
import { fetchPortfolioData } from "@/lib/sanity-service";
import WritingsSection from "@/components/sections/writings-section";
import GitHubStats from "@/components/sections/github-stats";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const portfolioData = await fetchPortfolioData();

  return (
    <>
      {/* Enhanced background design - FIXED BEHIND EVERYTHING */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Base background color */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Large animated gradient orbs - Subtle and elegant */}
        <div className="absolute -top-40 left-0 w-[700px] h-[700px] bg-primary/20 dark:bg-primary/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Very subtle grid pattern - starts after hero */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(128,128,128,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Very subtle dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(128,128,128,0.015)_1px,transparent_1px)] dark:bg-[radial-gradient(circle,rgba(128,128,128,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      </div>

      {/* Animated Hero with fading background */}
      <AnimatedHero />

      {/* Sections with patterns visible */}
      <div className="relative">
        <ExperienceEducationSection />

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <SkillsSection />

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <GitHubStats username="meshivanshsinghh" />

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Pass Sanity projects data */}
        <WorkSection projects={portfolioData.projects} />

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Pass Sanity blog posts data */}
        <WritingsSection blogPosts={portfolioData.blogPosts} />
      </div>
    </>
  );
}