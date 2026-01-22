import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import type { PersonalInfo } from "@/types/portfolio";

export default function PersonalInfoSection() {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalInfo>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/personal-info");
      const result = await response.json();
      setData(result);
      setFormData(result);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/personal-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFormData(result);
        alert("Personal info updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Failed to update personal info");
    } finally {
      setSaving(false);
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
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Personal Information</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Phone"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Input
            label="Email"
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="LinkedIn"
            value={formData.linkedin || ""}
            onChange={(e) =>
              setFormData({ ...formData, linkedin: e.target.value })
            }
          />
          <Input
            label="GitHub"
            value={formData.github || ""}
            onChange={(e) =>
              setFormData({ ...formData, github: e.target.value })
            }
          />
        </div>
        <Input
          label="Summary"
          value={formData.summary || ""}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          multiline
          minRows={5}
        />
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={saving}
          className="w-full md:w-auto"
        >
          Save Changes
        </Button>
      </CardBody>
    </Card>
  );
}
