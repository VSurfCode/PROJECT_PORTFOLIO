require("dotenv").config();

import { createAdminClient } from "../lib/supabase/server";
import type { SkillCategory } from "../types/portfolio";

const supabase = createAdminClient();

const personalInfo = {
  name: "Alexander Marston",
  title: "Full Stack Software Engineer (React / Node.js / TypeScript)",
  location: "Shelbyville, TN",
  phone: "(931) 842-7833",
  email: "amarston648@gmail.com",
  linkedin: "https://www.linkedin.com/in/alexander-marston-5795301a4",
  github: "https://github.com/VSurfCode",
  summary:
    "Full Stack Software Engineer with 5+ years of experience building and shipping web/mobile applications using React, TypeScript, Node.js, MongoDB, SQL, and Firebase. Proven ability to deliver production-ready systems, build internal tools, and integrate modern AI features. Strong communicator with leadership experience mentoring developers and teaching full stack engineering.",
};

const skills: Array<{ name: string; category: SkillCategory; order: number }> =
  [
    { name: "React", category: "frontend", order: 1 },
    { name: "React Native", category: "frontend", order: 2 },
    { name: "TypeScript", category: "frontend", order: 3 },
    { name: "JavaScript", category: "frontend", order: 4 },
    { name: "HTML/CSS", category: "frontend", order: 5 },
    { name: "Tailwind", category: "frontend", order: 6 },
    { name: "MUI", category: "frontend", order: 7 },
    { name: "React Router", category: "frontend", order: 8 },
    { name: "Node.js", category: "backend", order: 1 },
    { name: "Express", category: "backend", order: 2 },
    { name: "REST APIs", category: "backend", order: 3 },
    { name: "MongoDB", category: "backend", order: 4 },
    { name: "SQL", category: "backend", order: 5 },
    { name: "Firebase", category: "backend", order: 6 },
    { name: "Firestore", category: "backend", order: 7 },
    { name: "Cloud Functions", category: "backend", order: 8 },
    { name: "OpenAI Chat", category: "ai", order: 1 },
    { name: "OpenAI Assistants", category: "ai", order: 2 },
    { name: "OpenAI Realtime", category: "ai", order: 3 },
    { name: "OpenAI Moderation", category: "ai", order: 4 },
    { name: "OpenAI TTS", category: "ai", order: 5 },
    { name: "Stripe", category: "tools", order: 1 },
    { name: "Git", category: "tools", order: 2 },
    { name: "Jira", category: "tools", order: 3 },
    { name: "Agile/Scrum", category: "tools", order: 4 },
    { name: "CI/CD", category: "tools", order: 5 },
    { name: "Vercel", category: "tools", order: 6 },
    { name: "Render", category: "tools", order: 7 },
    { name: "Electron", category: "other", order: 1 },
    { name: "Django", category: "other", order: 2 },
    { name: "Three.js/R3F", category: "other", order: 3 },
    { name: "D3", category: "other", order: 4 },
    { name: "Recharts", category: "other", order: 5 },
  ];

const projects = [
  {
    title: "NerdHerd Tech Repair",
    description: "AI Service Booking + Admin Dashboard",
    long_description:
      "A comprehensive service booking platform with AI-powered diagnosis chatbot and admin dashboard for managing repair requests and tracking statistics.",
    tech_stack: [
      "React",
      "TypeScript",
      "Tailwind",
      "Firestore",
      "OpenAI Chat",
      "OpenAI Moderation",
      "Recharts",
    ],
    live_url: "https://project-nerd.onrender.com/",
    github_url: null,
    thumbnail_url: null,
    story_problem:
      "Need for service booking and repair request workflows with validation and LocalStorage persistence.",
    story_decisions:
      "Integrated AI diagnosis chatbot with moderation filtering and stored results in Firestore. Added admin dashboard and repair stats visualization with Recharts.",
    story_result:
      "Built service booking system with admin dashboard and repair stats visualization. AI chatbot provides instant diagnosis assistance with content moderation.",
    featured: true,
    display_order: 1,
  },
  {
    title: "TutorCraft (Project Cypher)",
    description: "AI Tutoring Platform",
    long_description:
      "An AI-powered tutoring platform with text and low-latency voice sessions, real-time conversation updates, quiz generation, and subscription management.",
    tech_stack: [
      "React",
      "Firebase",
      "OpenAI Assistants",
      "OpenAI Realtime",
      "Stripe",
      "Cloud Functions",
      "MUI",
    ],
    live_url: "https://project-cypher-1.onrender.com/",
    github_url: null,
    thumbnail_url: null,
    story_problem:
      "Need for AI tutoring platform with text and voice capabilities, quiz generation, and subscription management.",
    story_decisions:
      "Used OpenAI Realtime API for low-latency voice sessions, Stripe for subscriptions via Cloud Functions, and Firebase for authentication and data storage.",
    story_result:
      "Built AI tutoring with text + voice sessions, quiz generation from conversation history, auth (Google + email), protected dashboards, and Stripe subscriptions.",
    featured: true,
    display_order: 2,
  },
];

const experience = [
  {
    company: "Persevere",
    title: "Full Stack Software Engineer / Instructor",
    location: "Memphis, TN",
    start_date: "2023-01-01",
    end_date: null,
    description: [
      "Instruct full stack cohorts (11–25 students) across React, Node/Express, MongoDB, REST APIs, Git, Agile",
      "Built curriculum and real-world projects focused on production-style workflows and debugging",
      "Mentored developers on architecture, clean code practices, and team collaboration",
    ],
    achievements: null,
    display_order: 1,
  },
  {
    company: "Banyan Labs",
    title: "Full Stack Software Engineer",
    location: "Memphis, TN",
    start_date: "2019-10-01",
    end_date: "2023-02-28",
    description: [
      "Built and shipped full stack applications using React, TypeScript, Node.js, MongoDB on Agile teams (15+ engineers)",
      "Developed internal platforms and tooling to streamline workflows and improve operational efficiency",
      "Supported applications for a national career org serving 250M+ users",
    ],
    achievements: [
      "Delivered a desktop application that reduced client needs assessment response time by 25%",
    ],
    display_order: 2,
  },
  {
    company: "Vant4ge",
    title: "Software Engineer (Full Stack / Microservices)",
    location: "Salt Lake City, UT",
    start_date: "2021-07-01",
    end_date: "2022-05-31",
    description: [
      "Engineered a microservice system with 30+ services using C#, Vue.js, SQL, improving scalability and reducing downtime",
      "Built secure workflow tools improving assessment accuracy and reducing manual effort",
      "Contributed to a secure mobile app improving case manager/client communication and documentation",
    ],
    achievements: null,
    display_order: 3,
  },
];

const education = [
  {
    institution: "Persevere",
    degree: "Full Stack Web Development Certification",
    location: "Memphis, TN",
    date: null,
    display_order: 1,
  },
];

async function migrate() {
  console.log("Starting migration...\n");

  try {
    console.log("1. Inserting personal info...");
    const { data: existingPersonal } = await supabase
      .from("personal_info")
      .select("id")
      .limit(1)
      .single();

    let personalData;
    if (existingPersonal) {
      const { data: updated, error: updateError } = await supabase
        .from("personal_info")
        .update(personalInfo)
        .eq("id", existingPersonal.id)
        .select()
        .single();
      if (updateError) throw updateError;
      personalData = updated;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("personal_info")
        .insert(personalInfo)
        .select()
        .single();
      if (insertError) throw insertError;
      personalData = inserted;
    }

    console.log("✓ Personal info inserted\n");

    console.log("2. Inserting skills...");
    const skillInserts = skills.map((skill) => ({
      name: skill.name,
      category: skill.category,
      display_order: skill.order,
    }));

    const { data: skillsData, error: skillsError } = await supabase
      .from("skills")
      .upsert(skillInserts, { onConflict: "name" })
      .select();

    if (skillsError) throw skillsError;
    console.log(`✓ ${skillsData.length} skills inserted\n`);

    const skillMap = new Map(
      skillsData.map((skill) => [skill.name, skill.id])
    );

    console.log("3. Inserting projects...");
    const projectsData = [];

    for (const project of projects) {
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("title", project.title)
        .single();

      const projectData = {
        title: project.title,
        description: project.description,
        long_description: project.long_description,
        tech_stack: project.tech_stack,
        live_url: project.live_url,
        github_url: project.github_url,
        thumbnail_url: project.thumbnail_url,
        story_problem: project.story_problem,
        story_decisions: project.story_decisions,
        story_result: project.story_result,
        featured: project.featured,
        display_order: project.display_order,
      };

      if (existing) {
        const { data: updated, error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        projectsData.push(updated);
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (insertError) throw insertError;
        projectsData.push(inserted);
      }
    }

    console.log(`✓ ${projectsData.length} projects inserted/updated\n`);

    console.log("4. Linking projects to skills...");
    const projectSkillLinks: Array<{ project_id: string; skill_id: string }> =
      [];

    projectsData.forEach((project) => {
      const projectData = projects.find((p) => p.title === project.title);
      if (projectData) {
        projectData.tech_stack.forEach((techName) => {
          const skillId = skillMap.get(techName);
          if (skillId) {
            projectSkillLinks.push({
              project_id: project.id,
              skill_id: skillId,
            });
          }
        });
      }
    });

    if (projectSkillLinks.length > 0) {
      const { error: linksError } = await supabase
        .from("project_skills")
        .upsert(projectSkillLinks, { onConflict: "project_id,skill_id" });

      if (linksError) throw linksError;
      console.log(`✓ ${projectSkillLinks.length} project-skill links created\n`);
    }

    console.log("5. Inserting experience...");
    const experienceInserts = experience.map((exp) => ({
      company: exp.company,
      title: exp.title,
      location: exp.location,
      start_date: exp.start_date,
      end_date: exp.end_date,
      description: exp.description,
      achievements: exp.achievements,
      display_order: exp.display_order,
    }));

    const { data: experienceData, error: experienceError } = await supabase
      .from("experience")
      .upsert(experienceInserts)
      .select();

    if (experienceError) throw experienceError;
    console.log(`✓ ${experienceData.length} experience entries inserted\n`);

    console.log("6. Inserting education...");
    const educationInserts = education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      location: edu.location,
      date: edu.date,
      display_order: edu.display_order,
    }));

    const { data: educationData, error: educationError } = await supabase
      .from("education")
      .upsert(educationInserts)
      .select();

    if (educationError) throw educationError;
    console.log(`✓ ${educationData.length} education entries inserted\n`);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
