import DefaultLayout from "@/layouts/default";
import {
  HeroSection,
  ProjectsSection,
  SkillsSection,
  ExperienceSection,
  EducationSection,
  ContactSection,
} from "@/components/sections";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <HeroSection />
      
      {/* Container for the Spider-Verse angled sections. 
          The background color here forms the thick "black lines" between the panels! */}
      <div className="bg-[var(--color-comic-ink)] relative z-10 flex flex-col overflow-hidden">
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </div>
    </DefaultLayout>
  );
}
