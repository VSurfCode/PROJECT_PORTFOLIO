import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import type { Education } from "@/types/portfolio";

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/admin/education");
      const result = await response.json();
      setEducation(result);
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setFormData(edu);
    onOpen();
  };

  const handleAdd = () => {
    setEditingEducation(null);
    setFormData({
      institution: "",
      degree: "",
      location: "",
      date: null,
      display_order: 0,
    });
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/education";
      const method = editingEducation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingEducation
            ? { ...formData, id: editingEducation.id }
            : formData
        ),
      });

      if (response.ok) {
        await fetchEducation();
        onClose();
        alert(editingEducation ? "Education updated!" : "Education created!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const response = await fetch(`/api/admin/education?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchEducation();
        alert("Education deleted!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to delete education");
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
          <h2 className="text-xl font-semibold">Education</h2>
          <Button color="primary" onPress={handleAdd}>
            Add Education
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-default-500">
                        {edu.institution} • {edu.location}
                        {edu.date && ` • ${edu.date}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleEdit(edu)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(edu.id)}
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {editingEducation ? "Edit Education" : "Add Education"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Institution"
              value={formData.institution || ""}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
            />
            <Input
              label="Degree"
              value={formData.degree || ""}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
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
              label="Date"
              value={formData.date || ""}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value || null })
              }
              placeholder="e.g., 2023"
            />
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
