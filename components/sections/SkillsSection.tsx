import { useEffect, useState, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { GlassCard } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";
import type { Skill, SkillCategory } from "@/types/portfolio";
import { motion } from "motion/react";

const categories: SkillCategory[] = ["frontend", "backend", "ai", "tools", "other"];

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

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  if (loading) {
    return (
      <section id="skills" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: catIndex * 0.1, ease: "easeOut" }}
              >
                <GlassCard hover={false} glow={false}>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 capitalize">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.3, delay: skillIndex * 0.03 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip
                            size="md"
                            variant={
                              selectedSkills.has(skill.id) ? "solid" : "flat"
                            }
                            color={selectedSkills.has(skill.id) ? "primary" : "default"}
                            className="cursor-pointer transition-all"
                            onClick={() => handleSkillClick(skill.id)}
                            onDoubleClick={() => handleSkillDoubleClick(skill.name)}
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
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
