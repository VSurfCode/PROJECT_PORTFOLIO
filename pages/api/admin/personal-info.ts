import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createAdminClient();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { data: existing } = await supabase
      .from("personal_info")
      .select("id")
      .limit(1)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("personal_info")
        .update(req.body)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } else {
      const { data, error } = await supabase
        .from("personal_info")
        .insert(req.body)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
