import type { NextApiRequest, NextApiResponse } from "next";

import { createServerClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("voice_settings")
      .select("show_boid_controls")
      .eq("id", 1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      throw error;
    }

    return res.status(200).json({
      show_boid_controls: data?.show_boid_controls !== false,
    });
  } catch (error: any) {
    console.error("Error fetching voice settings:", error);

    return res.status(500).json({
      error: "Failed to fetch voice settings",
      show_boid_controls: true,
    });
  }
}
