import type { Skill, SkillCategory } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";

const categories: SkillCategory[] = [
  "frontend",
  "backend",
  "ai",
  "tools",
  "other",
];

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills");
      const result = await response.json();

      setSkills(result);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    onOpen();
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "frontend",
      display_order: 0,
    });
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/skills";
      const method = editingSkill ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingSkill ? { ...formData, id: editingSkill.id } : formData,
        ),
      });

      if (response.ok) {
        await fetchSkills();
        onClose();
        alert(editingSkill ? "Skill updated!" : "Skill created!");
      } else {
        const error = await response.json();

        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSkills();
        alert("Skill deleted!");
      } else {
        const error = await response.json();

        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to delete skill");
    }
  };

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);

      return acc;
    },
    {} as Record<SkillCategory, Skill[]>,
  );

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
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button color="primary" onPress={handleAdd}>
            Add Skill
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsByCategory[category]?.map((skill) => (
                    <Chip
                      key={skill.id}
                      color="primary"
                      variant="flat"
                      onClose={() => handleDelete(skill.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{skill.name}</span>
                        <Button
                          className="min-w-0 h-auto p-1"
                          size="sm"
                          variant="light"
                          onPress={() => handleEdit(skill)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editingSkill ? "Edit Skill" : "Add Skill"}</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Skill Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Select
              label="Category"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as SkillCategory;

                setFormData({ ...formData, category: selected });
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order?.toString() || "0"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: parseInt(e.target.value) || 0,
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" isLoading={saving} onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
