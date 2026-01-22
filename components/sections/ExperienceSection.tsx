import type { Experience } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { GlassCard } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });

      if (!error && data) {
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Present";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <section className="py-20 px-6" id="experience">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading experience...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6" id="experience">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Experience
        </motion.h2>
        <div className="relative">
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-default-200 dark:bg-default-700"
            initial={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
            whileInView={{ scaleY: 1 }}
          />
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-20"
                initial={{ opacity: 0, x: -50 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                viewport={{ once: false, margin: "-50px" }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <motion.div
                  className="absolute left-6 w-4 h-4 rounded-full bg-primary border-4 border-background"
                  initial={{ scale: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                  viewport={{ once: false }}
                  whileInView={{ scale: 1 }}
                />
                <GlassCard glow={false} hover={false}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold">{exp.title}</h3>
                        <p className="text-lg text-primary">{exp.company}</p>
                        <p className="text-sm text-default-500">
                          {exp.location}
                        </p>
                      </div>
                      <div className="text-sm text-default-500 mt-2 md:mt-0">
                        {formatDate(exp.start_date)} -{" "}
                        {formatDate(exp.end_date)}
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-default-600">
                      {exp.description.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-primary">
                          Key Achievements:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-default-600">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
