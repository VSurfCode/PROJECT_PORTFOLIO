import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import type { Experience } from "@/types/portfolio";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [descriptionText, setDescriptionText] = useState("");
  const [achievementsText, setAchievementsText] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/admin/experience");
      const result = await response.json();
      setExperiences(result);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData(exp);
    setDescriptionText(exp.description.join("\n"));
    setAchievementsText(exp.achievements?.join("\n") || "");
    onOpen();
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setFormData({
      company: "",
      title: "",
      location: "",
      start_date: "",
      end_date: null,
      description: [],
      achievements: null,
      display_order: 0,
    });
    setDescriptionText("");
    setAchievementsText("");
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const description = descriptionText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const achievements = achievementsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        description,
        achievements: achievements.length > 0 ? achievements : null,
      };

      const url = "/api/admin/experience";
      const method = editingExperience ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingExperience
            ? { ...payload, id: editingExperience.id }
            : payload
        ),
      });

      if (response.ok) {
        await fetchExperiences();
        onClose();
        alert(editingExperience ? "Experience updated!" : "Experience created!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchExperiences();
        alert("Experience deleted!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to delete experience");
    }
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
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <Button color="primary" onPress={handleAdd}>
            Add Experience
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card key={exp.id}>
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {exp.title} at {exp.company}
                      </h3>
                      <p className="text-sm text-default-500">
                        {exp.location} • {exp.start_date} -{" "}
                        {exp.end_date || "Present"}
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        {exp.description.map((desc, idx) => (
                          <li key={idx}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleEdit(exp)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(exp.id)}
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
            {editingExperience ? "Edit Experience" : "Add Experience"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <Input
                label="Title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Input
                label="Location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <Input
                type="date"
                label="Start Date"
                value={formData.start_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
              <Input
                type="date"
                label="End Date (leave empty for current)"
                value={formData.end_date || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_date: e.target.value || null,
                  })
                }
              />
            </div>
            <Input
              label="Description (one per line)"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              multiline
              minRows={4}
            />
            <Input
              label="Achievements (one per line, optional)"
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              multiline
              minRows={2}
            />
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
