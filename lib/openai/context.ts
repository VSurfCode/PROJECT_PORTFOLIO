import { supabase } from "@/lib/supabase/client";

export async function generatePortfolioContext(): Promise<string> {
  try {
    const [
      personalData,
      projectsData,
      experienceData,
      skillsData,
      educationData,
    ] = await Promise.all([
      supabase.from("personal_info").select("*").limit(1).single(),
      supabase.from("projects").select("*").order("display_order"),
      supabase.from("experience").select("*").order("start_date", {
        ascending: false,
      }),
      supabase.from("skills").select("*"),
      supabase.from("education").select("*").order("display_order"),
    ]);

    const personal = personalData.data;
    const projects = projectsData.data || [];
    const experience = experienceData.data || [];
    const skills = skillsData.data || [];
    const education = educationData.data || [];

    const context = {
      personal: personal
        ? {
            name: personal.name,
            title: personal.title,
            location: personal.location,
            summary: personal.summary,
            email: personal.email,
            linkedin: personal.linkedin,
            github: personal.github,
          }
        : null,
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        tech_stack: p.tech_stack,
        story_problem: p.story_problem,
        story_decisions: p.story_decisions,
        story_result: p.story_result,
        live_url: p.live_url,
      })),
      experience: experience.map((e) => ({
        company: e.company,
        title: e.title,
        location: e.location,
        start_date: e.start_date,
        end_date: e.end_date,
        description: e.description,
        achievements: e.achievements,
      })),
      education: education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        location: edu.location,
        date: edu.date,
      })),
      skills: skills.map((s) => ({
        name: s.name,
        category: s.category,
      })),
    };

    return JSON.stringify(context, null, 2);
  } catch (error) {
    console.error("Error generating portfolio context:", error);

    return "{}";
  }
}
