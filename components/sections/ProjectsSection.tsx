import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { GlassCard, NeonButton } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";
import type { Project, Skill } from "@/types/portfolio";
import { motion } from "motion/react";

interface ProjectWithSkills extends Project {
  skills: Skill[];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectWithSkills | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("display_order", { ascending: true });

      if (projectsError) throw projectsError;

      const projectsWithSkills = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: skillsData } = await supabase
            .from("project_skills")
            .select("skills(*)")
            .eq("project_id", project.id);

          return {
            ...project,
            skills: (skillsData || []).map((ps: any) => ps.skills).filter(Boolean),
          };
        })
      );

      setProjects(projectsWithSkills);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: ProjectWithSkills) => {
    setSelectedProject(project);
    onOpen();
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Featured Projects
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="w-full max-w-md md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <GlassCard
                  hover
                  glow={false}
                  isPressable
                  onPress={() => handleProjectClick(project)}
                  className="cursor-pointer h-full flex flex-col min-h-[400px]"
                >
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <h3 className="text-2xl font-semibold">{project.title}</h3>
                    <p className="text-default-600 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 4).map((tech, idx) => (
                        <Chip key={idx} size="sm" variant="flat" color="primary">
                          {tech}
                        </Chip>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <Chip size="sm" variant="flat">
                          +{project.tech_stack.length - 4}
                        </Chip>
                      )}
                    </div>
                    <div className="mt-auto">
                      {project.live_url && (
                        <NeonButton
                          size="sm"
                          variant="bordered"
                          as="a"
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onPress={(e) => e.stopPropagation()}
                          className="w-full"
                        >
                          View Live
                        </NeonButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-background/95 backdrop-blur-md border border-default-200 dark:border-default-700",
          backdrop: "bg-black/70 backdrop-blur-sm",
          header: "border-b border-default-200 dark:border-default-700",
          body: "py-6",
          footer: "border-t border-default-200 dark:border-default-700",
        }}
      >
        <ModalContent>
          {selectedProject && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-foreground">{selectedProject.title}</h3>
                <p className="text-default-500">{selectedProject.description}</p>
              </ModalHeader>
              <ModalBody className="space-y-6">
                {selectedProject.long_description && (
                  <p className="text-foreground">{selectedProject.long_description}</p>
                )}
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack.map((tech, idx) => (
                      <Chip key={idx} size="sm" variant="flat" color="primary">
                        {tech}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Problem</h4>
                    <p className="text-foreground">{selectedProject.story_problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Decisions</h4>
                    <p className="text-foreground">{selectedProject.story_decisions}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Result</h4>
                    <p className="text-foreground">{selectedProject.story_result}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {selectedProject.live_url && (
                  <NeonButton
                    as="a"
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    glow
                  >
                    View Live
                  </NeonButton>
                )}
                {selectedProject.github_url && (
                  <Button
                    variant="bordered"
                    as="a"
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Button>
                )}
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
