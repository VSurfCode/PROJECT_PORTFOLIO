import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createAdminClient();

  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_skills(skills(*))")
        .eq("id", id)
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { skill_ids, ...projectData } = req.body;

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert(projectData)
      .select()
      .single();

    if (projectError) {
      return res.status(500).json({ error: projectError.message });
    }

    if (skill_ids && skill_ids.length > 0) {
      const projectSkills = skill_ids.map((skillId: string) => ({
        project_id: project.id,
        skill_id: skillId,
      }));

      const { error: linkError } = await supabase
        .from("project_skills")
        .insert(projectSkills);

      if (linkError) {
        return res.status(500).json({ error: linkError.message });
      }
    }

    return res.status(201).json(project);
  }

  if (req.method === "PUT") {
    const { id, skill_ids, ...projectData } = req.body;

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();

    if (projectError) {
      return res.status(500).json({ error: projectError.message });
    }

    if (skill_ids !== undefined) {
      await supabase.from("project_skills").delete().eq("project_id", id);

      if (skill_ids.length > 0) {
        const projectSkills = skill_ids.map((skillId: string) => ({
          project_id: id,
          skill_id: skillId,
        }));

        await supabase.from("project_skills").insert(projectSkills);
      }
    }

    return res.status(200).json(project);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
