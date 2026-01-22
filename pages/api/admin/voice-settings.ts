import type { NextApiRequest, NextApiResponse } from "next";

import { createAdminClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createAdminClient();

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("voice_settings")
        .select("voice, show_boid_controls, use_tts")
        .eq("id", 1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Supabase error:", error);
        throw error;
      }

      return res.status(200).json({
        voice: data?.voice || "alloy",
        show_boid_controls: data?.show_boid_controls !== false,
        use_tts: data?.use_tts !== false,
      });
    } catch (error: any) {
      console.error("Error fetching voice settings:", error);

      return res.status(500).json({
        error: "Failed to fetch voice settings",
        details: error.message,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { voice, show_boid_controls, use_tts } = req.body;

      const validVoices = [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
        "marin",
        "cedar",
      ];

      if (!voice || !validVoices.includes(voice)) {
        return res.status(400).json({ error: "Invalid voice selection" });
      }

      const updateData: any = {
        voice,
        updated_at: new Date().toISOString(),
      };

      if (typeof show_boid_controls === "boolean") {
        updateData.show_boid_controls = show_boid_controls;
      } else if (show_boid_controls === undefined) {
        updateData.show_boid_controls = true;
      }

      if (typeof use_tts === "boolean") {
        updateData.use_tts = use_tts;
      } else if (use_tts === undefined) {
        updateData.use_tts = true;
      }

      const { data: existing, error: checkError } = await supabase
        .from("voice_settings")
        .select("id")
        .eq("id", 1)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing:", checkError);
        throw checkError;
      }

      if (existing) {
        const updatePayload: any = {
          voice: updateData.voice,
          updated_at: updateData.updated_at,
        };

        if (typeof updateData.show_boid_controls === "boolean") {
          updatePayload.show_boid_controls = updateData.show_boid_controls;
        }

        if (typeof updateData.use_tts === "boolean") {
          updatePayload.use_tts = updateData.use_tts;
        }

        const { error } = await supabase
          .from("voice_settings")
          .update(updatePayload)
          .eq("id", 1);

        if (error) {
          console.error("Update error:", error);
          if (error.message?.includes("column")) {
            const missingColumn = error.message.includes("use_tts")
              ? "use_tts"
              : error.message.includes("show_boid_controls")
                ? "show_boid_controls"
                : "unknown";

            return res.status(500).json({
              error: `Database schema needs to be updated. Please run: ALTER TABLE voice_settings ADD COLUMN IF NOT EXISTS ${missingColumn} BOOLEAN DEFAULT true;`,
              details: error.message,
            });
          }
          if (
            error.message?.includes("voice_settings_voice_check") ||
            error.code === "23514"
          ) {
            return res.status(500).json({
              error:
                "Database constraint needs to be updated to include Marin and Cedar voices. Please run the migration SQL in supabase/migration_add_marin_cedar.sql",
              details: error.message,
              sql: "ALTER TABLE voice_settings DROP CONSTRAINT IF EXISTS voice_settings_voice_check; ALTER TABLE voice_settings ADD CONSTRAINT voice_settings_voice_check CHECK (voice IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'marin', 'cedar'));",
            });
          }
          throw error;
        }
      } else {
        const insertData: any = {
          id: 1,
          voice: updateData.voice,
          updated_at: updateData.updated_at,
        };

        if (typeof updateData.show_boid_controls === "boolean") {
          insertData.show_boid_controls = updateData.show_boid_controls;
        } else {
          insertData.show_boid_controls = true;
        }

        if (typeof updateData.use_tts === "boolean") {
          insertData.use_tts = updateData.use_tts;
        } else {
          insertData.use_tts = true;
        }

        const { error } = await supabase
          .from("voice_settings")
          .insert(insertData);

        if (error) {
          console.error("Insert error:", error);
          if (error.message?.includes("column")) {
            const missingColumn = error.message.includes("use_tts")
              ? "use_tts"
              : error.message.includes("show_boid_controls")
                ? "show_boid_controls"
                : "unknown";

            return res.status(500).json({
              error: `Database schema needs to be updated. Please run: ALTER TABLE voice_settings ADD COLUMN IF NOT EXISTS ${missingColumn} BOOLEAN DEFAULT true;`,
              details: error.message,
            });
          }
          if (
            error.message?.includes("voice_settings_voice_check") ||
            error.code === "23514"
          ) {
            return res.status(500).json({
              error:
                "Database constraint needs to be updated to include Marin and Cedar voices. Please run the migration SQL in supabase/migration_add_marin_cedar.sql",
              details: error.message,
              sql: "ALTER TABLE voice_settings DROP CONSTRAINT IF EXISTS voice_settings_voice_check; ALTER TABLE voice_settings ADD CONSTRAINT voice_settings_voice_check CHECK (voice IN ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'marin', 'cedar'));",
            });
          }
          throw error;
        }
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error saving voice settings:", error);

      return res.status(500).json({
        error: "Failed to save voice settings",
        details: error.message || error.toString(),
        code: error.code,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
