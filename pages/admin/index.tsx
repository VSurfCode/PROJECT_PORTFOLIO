import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import PersonalInfoSection from "@/components/admin/PersonalInfoSection";
import ProjectsSection from "@/components/admin/ProjectsSection";
import SkillsSection from "@/components/admin/SkillsSection";
import ExperienceSection from "@/components/admin/ExperienceSection";
import EducationSection from "@/components/admin/EducationSection";
import VoiceSettingsSection from "@/components/admin/VoiceSettingsSection";

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setAuthenticated(true);
    } else {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-default-500">Manage your portfolio content</p>
        </div>
        <Button color="danger" variant="flat" onPress={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs aria-label="Admin sections" className="mb-6">
        <Tab key="personal" title="Personal Info">
          <PersonalInfoSection />
        </Tab>
        <Tab key="projects" title="Projects">
          <ProjectsSection />
        </Tab>
        <Tab key="skills" title="Skills">
          <SkillsSection />
        </Tab>
        <Tab key="experience" title="Experience">
          <ExperienceSection />
        </Tab>
        <Tab key="education" title="Education">
          <EducationSection />
        </Tab>
        <Tab key="voice" title="Voice Settings">
          <VoiceSettingsSection />
        </Tab>
      </Tabs>
    </div>
  );
}
