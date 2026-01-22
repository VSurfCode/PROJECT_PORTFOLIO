import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";

const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
  { value: "marin", label: "Marin (Realtime only)" },
  { value: "cedar", label: "Cedar (Realtime only)" },
];

export default function VoiceSettingsSection() {
  const [voice, setVoice] = useState<string>("alloy");
  const [useTTS, setUseTTS] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchVoiceSettings();
  }, []);

  const fetchVoiceSettings = async () => {
    try {
      const response = await fetch("/api/admin/voice-settings");

      if (response.ok) {
        const data = await response.json();

        setVoice(data.voice || "alloy");
        setUseTTS(data.use_tts !== false);
      }
    } catch (error) {
      console.error("Error fetching voice settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/voice-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voice, use_tts: useTTS }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Voice settings saved successfully!",
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();

        setMessage({
          type: "error",
          text: error.error || error.details || "Failed to save voice settings",
        });
      }
    } catch (error) {
      console.error("Error saving voice settings:", error);
      setMessage({ type: "error", text: "Failed to save voice settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
          <p className="text-sm text-default-500 mb-4">
            Choose the voice for the AI assistant. Changes will take effect on
            the next connection.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <Select
            className="max-w-xs"
            label="AI Voice"
            selectedKeys={[voice]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;

              setVoice(selected);
            }}
          >
            {VOICE_OPTIONS.map((option) => (
              <SelectItem key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          {(voice === "marin" || voice === "cedar") && useTTS && (
            <div className="p-3 rounded-md text-sm bg-warning/10 text-warning border border-warning/20">
              ⚠️ {voice.charAt(0).toUpperCase() + voice.slice(1)} is a
              Realtime-only voice. Please disable TTS mode to use it.
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                checked={useTTS}
                className="w-4 h-4"
                id="useTTS"
                type="checkbox"
                onChange={(e) => setUseTTS(e.target.checked)}
              />
              <label className="text-sm cursor-pointer" htmlFor="useTTS">
                Use High-Quality TTS (Better voices, ~300-600ms latency)
              </label>
            </div>
          </div>

          <Button
            color="primary"
            disabled={saving}
            isLoading={saving}
            onPress={handleSave}
          >
            Save Settings
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
