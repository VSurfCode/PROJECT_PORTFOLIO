import type { Education } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { supabase } from "@/lib/supabase/client";

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
      <section className="py-20 px-6" id="education">
        <div className="max-w-7xl mx-auto">
          <div
            className="font-comic text-2xl tracking-wider text-center animate-pulse"
            style={{ color: "var(--color-comic-yellow)" }}
          >
            LOADING EDUCATION...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="comic-section comic-panel-4 comic-section-green py-20 px-6" id="education">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="comic-heading text-4xl md:text-6xl">Education</h2>
          <div
            className="mt-4 mx-auto h-1 w-28"
            style={{ background: "var(--color-comic-yellow)" }}
          />
        </motion.div>

        {/* Education cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: false, margin: "-50px" }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            >
              <div className="comic-card relative">
                {/* Corner page curl effect */}
                <div
                  className="absolute top-0 right-0 w-12 h-12 z-[2]"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, rgba(255,217,61,0.15) 50%)",
                  }}
                />

                {/* Panel badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 font-comic text-xs z-[2]"
                  style={{
                    background: "var(--color-comic-purple)",
                    color: "white",
                    border: "2px solid var(--color-comic-ink)",
                  }}
                >
                  EDU
                </div>

                <div className="pt-8 relative z-[1]">
                  <h3
                    className="font-comic text-xl tracking-wide mb-2"
                    style={{ color: "var(--color-comic-yellow)" }}
                  >
                    {edu.degree}
                  </h3>
                  <p
                    className="font-comic text-lg tracking-wide"
                    style={{ color: "var(--color-comic-blue)" }}
                  >
                    {edu.institution}
                  </p>
                  <div
                    className="mt-3 flex items-center gap-3 font-comic-body text-sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <span>📍 {edu.location}</span>
                    {edu.date && (
                      <>
                        <span style={{ color: "var(--color-comic-yellow)" }}>
                          •
                        </span>
                        <span className="comic-chip comic-chip-yellow text-xs">
                          {edu.date}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
