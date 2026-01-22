import type { Skill, SkillCategory } from "@/types/portfolio";

import { useEffect, useState, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { motion } from "motion/react";

import { GlassCard } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";

const categories: SkillCategory[] = [
  "frontend",
  "backend",
  "ai",
  "tools",
  "other",
];

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

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

  const handleSkillClick = useCallback((skillId: string) => {
    setSelectedSkills((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }

      return newSet;
    });
  }, []);

  const handleSkillDoubleClick = useCallback((skillName: string) => {
    const projectsSection = document.getElementById("projects");

    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);

      return acc;
    },
    {} as Record<SkillCategory, Skill[]>,
  );

  if (loading) {
    return (
      <section className="py-20 px-6" id="skills">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6" id="skills">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Skills
        </motion.h2>
        <div className="space-y-8">
          {categories.map((category, catIndex) => {
            const categorySkills = skillsByCategory[category] || [];

            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -30 }}
                transition={{
                  duration: 0.5,
                  delay: catIndex * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: false, margin: "-50px" }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <GlassCard glow={false} hover={false}>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 capitalize">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            duration: 0.3,
                            delay: skillIndex * 0.03,
                          }}
                          viewport={{ once: false }}
                          whileHover={{ scale: 1.1 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip
                            className="cursor-pointer transition-all"
                            color={
                              selectedSkills.has(skill.id)
                                ? "primary"
                                : "default"
                            }
                            size="md"
                            variant={
                              selectedSkills.has(skill.id) ? "solid" : "flat"
                            }
                            onClick={() => handleSkillClick(skill.id)}
                            onDoubleClick={() =>
                              handleSkillDoubleClick(skill.name)
                            }
                          >
                            {skill.name}
                          </Chip>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
        {selectedSkills.size > 0 && (
          <motion.div
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-default-500">
              {selectedSkills.size} skill{selectedSkills.size !== 1 ? "s" : ""}{" "}
              selected. Double-click a skill to jump to projects.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
