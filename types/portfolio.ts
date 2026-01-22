export type SkillCategory = "frontend" | "backend" | "ai" | "tools" | "other";

export interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  location: string;
  phone: string | null;
  email: string;
  linkedin: string | null;
  github: string | null;
  summary: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  story_problem: string;
  story_decisions: string;
  story_result: string;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  display_order: number;
  created_at: string;
}

export interface ProjectSkill {
  project_id: string;
  skill_id: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string[];
  achievements: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  date: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectWithSkills extends Project {
  skills: Skill[];
}

export const TABLES = {
  PERSONAL_INFO: "personal_info",
  PROJECTS: "projects",
  SKILLS: "skills",
  PROJECT_SKILLS: "project_skills",
  EXPERIENCE: "experience",
  EDUCATION: "education",
} as const;
