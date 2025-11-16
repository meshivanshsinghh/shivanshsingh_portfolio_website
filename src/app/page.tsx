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
      {/* Grid background for sections after hero */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl opacity-10 dark:opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl opacity-10 dark:opacity-20 animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      <div className="relative">
        {/* Animated Hero - No background */}
        <AnimatedHero />

        <ExperienceEducationSection />

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <SkillsSection />

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <GitHubStats username="meshivanshsinghh" />

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Pass Sanity projects data */}
      <WorkSection projects={portfolioData.projects} />

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Pass Sanity blog posts data */}
      <WritingsSection blogPosts={portfolioData.blogPosts} />
      </div>
    </>
  );
}