import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui";
import { supabase } from "@/lib/supabase/client";
import type { Education } from "@/types/portfolio";
import { motion } from "motion/react";

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setEducation(data);
      }
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="education" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">Loading education...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Education
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="w-full max-w-md"
            >
              <GlassCard hover glow={false}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                  <p className="text-lg text-primary mb-1">{edu.institution}</p>
                  <p className="text-sm text-default-500">
                    {edu.location}
                    {edu.date && ` • ${edu.date}`}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
