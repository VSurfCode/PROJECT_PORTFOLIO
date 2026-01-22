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
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ContactSection />
    </DefaultLayout>
  );
}
