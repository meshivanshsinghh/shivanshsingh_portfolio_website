import Hero from "@/components/sections/hero";
import ExperienceSection from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import WritingsSection from "@/components/sections/writings-section";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="pb-16">
      <Hero />
      <Separator className="my-8" />
      <ExperienceSection />
      <Separator className="my-8" />
      <ProjectsSection />
      <Separator className="my-8" />
      <WritingsSection />
    </div>
  );
}