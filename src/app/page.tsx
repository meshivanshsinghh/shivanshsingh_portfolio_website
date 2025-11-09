import Hero from "@/components/sections/hero";
import ExperienceSection from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import WritingsSection from "@/components/sections/writings-section";
import { fetchPortfolioData } from "@/lib/sanity-service";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const portfolioData = await fetchPortfolioData();

  return (
    <div className="relative">
      {/* Hero with announcement */}
      <Hero announcement={portfolioData.announcement} />
      
      {/* Gradient divider */}
      <div className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      {/* Content sections */}
      <div className="relative">
        <ExperienceSection />
        <ProjectsSection projects={portfolioData.projects} />
        <WritingsSection blogPosts={portfolioData.blogPosts} />
      </div>

      {/* Footer gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-background via-background/50 to-transparent pointer-events-none" />
    </div>
  );
}