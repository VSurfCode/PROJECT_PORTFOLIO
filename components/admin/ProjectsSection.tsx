import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import type { Project } from "@/types/portfolio";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      const result = await response.json();
      setProjects(result);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    onOpen();
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      long_description: "",
      tech_stack: [],
      live_url: "",
      github_url: "",
      story_problem: "",
      story_decisions: "",
      story_result: "",
      featured: false,
      display_order: 0,
    });
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingProject
        ? "/api/admin/projects"
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject ? { ...formData, id: editingProject.id } : formData),
      });

      if (response.ok) {
        await fetchProjects();
        onClose();
        alert(editingProject ? "Project updated!" : "Project created!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
        alert("Project deleted!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to delete project");
    }
  };

  const handleTechStackChange = (value: string) => {
    const stack = value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData({ ...formData, tech_stack: stack });
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <CardBody className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button color="primary" onPress={handleAdd}>
            Add Project
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-default-500 mt-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tech_stack.map((tech, idx) => (
                          <Chip key={idx} size="sm" variant="flat">
                            {tech}
                          </Chip>
                        ))}
                      </div>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm mt-2 block"
                        >
                          View Live
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleEdit(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {editingProject ? "Edit Project" : "Add Project"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Input
              label="Description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Input
              label="Long Description"
              value={formData.long_description || ""}
              onChange={(e) =>
                setFormData({ ...formData, long_description: e.target.value })
              }
              multiline
              minRows={3}
            />
            <Input
              label="Tech Stack (comma-separated)"
              value={formData.tech_stack?.join(", ") || ""}
              onChange={(e) => handleTechStackChange(e.target.value)}
              placeholder="React, TypeScript, Node.js"
            />
            <Input
              label="Live URL"
              value={formData.live_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, live_url: e.target.value })
              }
            />
            <Input
              label="GitHub URL"
              value={formData.github_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
            />
            <Input
              label="Story: Problem"
              value={formData.story_problem || ""}
              onChange={(e) =>
                setFormData({ ...formData, story_problem: e.target.value })
              }
              multiline
              minRows={2}
            />
            <Input
              label="Story: Decisions"
              value={formData.story_decisions || ""}
              onChange={(e) =>
                setFormData({ ...formData, story_decisions: e.target.value })
              }
              multiline
              minRows={2}
            />
            <Input
              label="Story: Result"
              value={formData.story_result || ""}
              onChange={(e) =>
                setFormData({ ...formData, story_result: e.target.value })
              }
              multiline
              minRows={2}
            />
            <div className="flex gap-4">
              <Input
                type="number"
                label="Display Order"
                value={formData.display_order?.toString() || "0"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="mr-2"
                />
                <label>Featured</label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave} isLoading={saving}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
