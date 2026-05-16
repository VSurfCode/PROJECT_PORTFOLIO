import type { Experience } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
          <div
            className="font-comic text-2xl tracking-wider text-center animate-pulse"
            style={{ color: "var(--color-comic-yellow)" }}
          >
            LOADING EXPERIENCE...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="comic-section comic-panel-3 comic-section-blue py-20 px-6" id="experience">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="comic-heading text-4xl md:text-6xl">Experience</h2>
          <div
            className="mt-4 mx-auto h-1 w-32"
            style={{ background: "var(--color-comic-yellow)" }}
          />
        </motion.div>

        {/* Timeline as comic strip */}
        <div className="relative">
          {/* Vertical timeline line */}
          <motion.div
            className="absolute left-8 md:left-12 top-0 bottom-0 w-1"
            initial={{ scaleY: 0 }}
            style={{
              background: "var(--color-comic-yellow)",
              transformOrigin: "top",
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ scaleY: 1 }}
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-20 md:pl-28"
                initial={{
                  opacity: 0,
                  x: -50,
                  rotate: index % 2 === 0 ? -1 : 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              >
                {/* Timeline node */}
                <motion.div
                  className="absolute left-5 md:left-9 w-7 h-7 flex items-center justify-center font-comic text-xs z-10"
                  initial={{ scale: 0 }}
                  style={{
                    background: "var(--color-comic-yellow)",
                    color: "var(--color-comic-ink)",
                    border: "3px solid var(--color-comic-ink)",
                    borderRadius: "4px",
                    top: "1.5rem",
                  }}
                  transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                  viewport={{ once: true }}
                  whileInView={{ scale: 1 }}
                >
                  {index + 1}
                </motion.div>

                {/* Experience card */}
                <div className="comic-card">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3
                        className="font-comic text-xl md:text-2xl tracking-wide"
                        style={{ color: "var(--color-comic-yellow)" }}
                      >
                        {exp.title}
                      </h3>
                      <p
                        className="font-comic text-lg tracking-wide"
                        style={{ color: "var(--color-comic-blue)" }}
                      >
                        {exp.company}
                      </p>
                      <p
                        className="text-sm font-comic-body"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        📍 {exp.location}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="comic-chip comic-chip-yellow text-xs">
                        {formatDate(exp.start_date)} →{" "}
                        {formatDate(exp.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Description bullets */}
                  <ul className="space-y-2 font-comic-body">
                    {exp.description.map((desc, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        <span
                          className="mt-1.5 flex-shrink-0 w-2 h-2"
                          style={{
                            background: "var(--color-comic-yellow)",
                            borderRadius: "2px",
                          }}
                        />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "2px dashed rgba(255,255,255,0.1)" }}>
                      <h4
                        className="font-comic tracking-wide mb-2 text-sm"
                        style={{ color: "var(--color-comic-orange)" }}
                      >
                        ⚡ KEY ACHIEVEMENTS
                      </h4>
                      <ul className="space-y-1 font-comic-body">
                        {exp.achievements.map((achievement, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            <span className="text-xs mt-0.5">★</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
