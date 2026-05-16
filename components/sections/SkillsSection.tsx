import type { Skill, SkillCategory } from "@/types/portfolio";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

import { supabase } from "@/lib/supabase/client";

const categories: SkillCategory[] = [
  "frontend",
  "backend",
  "ai",
  "tools",
  "other",
];

const statMeta: Record<
  SkillCategory,
  { fallback: string[]; label: string; score: number }
> = {
  frontend: {
    fallback: ["React", "TypeScript", "Tailwind"],
    label: "Frontend",
    score: 92,
  },
  backend: {
    fallback: ["Node.js", "Express", "PostgreSQL"],
    label: "Backend",
    score: 88,
  },
  ai: {
    fallback: ["OpenAI", "Codex", "Realtime"],
    label: "AI",
    score: 91,
  },
  tools: {
    fallback: ["Git", "Cursor", "Firebase"],
    label: "Tools",
    score: 84,
  },
  other: {
    fallback: ["Architecture", "Teaching", "Debugging"],
    label: "Systems",
    score: 80,
  },
};

function StatRing({
  index,
  label,
  score,
  skills,
}: {
  index: number;
  label: string;
  score: number;
  skills: string[];
}) {
  const progress = score / 100;

  return (
    <motion.article
      className="skill-stat-row"
      initial={{ opacity: 0, x: 50 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, margin: "-70px" }}
      whileHover={{ x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <div className="skill-stat-ring" aria-label={`${label} ${score}%`}>
        <svg viewBox="0 0 120 120">
          <circle className="skill-stat-track" cx="60" cy="60" r="45" />
          <motion.circle
            className="skill-stat-fill"
            cx="60"
            cy="60"
            initial={{ pathLength: 0 }}
            r="45"
            strokeLinecap="round"
            transition={{ delay: 0.25 + index * 0.12, duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ pathLength: progress }}
          />
        </svg>
        <span>{score}</span>
      </div>

      <div className="skill-stat-copy">
        <h3>{label}</h3>
        <div className="skill-stat-tags">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function SkillsSection() {
  const { theme } = useTheme();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const isVillain = theme === "dark";

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("category", { ascending: true })
          .order("display_order", { ascending: true });

        if (!error && data) {
          setSkills(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const stats = useMemo(() => {
    const skillsByCategory = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }

        acc[skill.category].push(skill.name);

        return acc;
      },
      {} as Record<SkillCategory, string[]>,
    );

    return categories.map((category) => ({
      ...statMeta[category],
      skills: skillsByCategory[category]?.length
        ? skillsByCategory[category]
        : statMeta[category].fallback,
    }));
  }, [skills]);

  return (
    <section
      className={`skills-profile-section ${isVillain ? "skills-profile-villain" : ""}`}
      id="skills"
    >
      <div className="skills-profile-inner">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="comic-heading text-4xl md:text-6xl">Skills</h2>
          <div className="skills-profile-title-line" />
        </motion.div>

        <div className="skills-profile-grid">
          <motion.div
            className="skills-character-panel"
            initial={{ opacity: 0, x: -70 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              alt={isVillain ? "Villain character" : "Superhero character"}
              className="skills-character-image"
              src={isVillain ? "/vilian.png" : "/superhero.png"}
            />
          </motion.div>

          <div className="skills-stat-stack">
            {loading ? (
              <div className="skills-loading">Loading stats...</div>
            ) : (
              stats.map((stat, index) => (
                <StatRing
                  key={stat.label}
                  index={index}
                  label={stat.label}
                  score={stat.score}
                  skills={stat.skills}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
