import Hero from "@/components/sections/hero";
import ExperienceSection from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import WritingsSection from "@/components/sections/writings-section";
import { Separator } from "@/components/ui/separator";
import { fetchPortfolioData } from "@/lib/sanity-service";

export const revalidate = 3600;

export default async function Home() {
  const portfolioData = await fetchPortfolioData();
  
  return (
    <div className="pb-16">
      <Hero />
      <Separator className="my-8" />
      <ExperienceSection />
      <Separator className="my-8" />
      <ProjectsSection projects={portfolioData.projects} />
      <Separator className="my-8" />
      <WritingsSection blogPosts={portfolioData.blogPosts} />
    </div>
  );
}