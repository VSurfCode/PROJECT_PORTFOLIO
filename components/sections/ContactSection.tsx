import type { PersonalInfo } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { supabase } from "@/lib/supabase/client";

export default function ContactSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        setPersonalInfo(data);
      }
    } catch (error) {
      console.error("Error fetching personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Message sent! (This is a demo - form submission not implemented)");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6" id="contact">
        <div className="max-w-7xl mx-auto">
          <div
            className="font-comic text-2xl tracking-wider text-center animate-pulse"
            style={{ color: "var(--color-comic-yellow)" }}
          >
            LOADING CONTACT...
          </div>
        </div>
      </section>
    );
  }

  if (!personalInfo) {
    return null;
  }

  return (
    <section className="comic-section comic-panel-5 comic-section-yellow py-20 px-6" id="contact">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="comic-heading text-4xl md:text-6xl">Get In Touch</h2>
          <div
            className="mt-4 mx-auto h-1 w-32"
            style={{ background: "var(--color-comic-yellow)" }}
          />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 items-stretch">
          {/* Contact Info Card */}
          <motion.div
            className="w-full md:w-[calc(50%-16px)] max-w-md flex"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="comic-card w-full flex flex-col">
              {/* Panel label */}
              <div
                className="absolute top-3 left-3 px-2 py-0.5 font-comic text-xs z-[2]"
                style={{
                  background: "var(--color-comic-blue)",
                  color: "var(--color-comic-ink)",
                  border: "2px solid var(--color-comic-ink)",
                }}
              >
                📬 INFO
              </div>

              <div className="pt-8 space-y-5 flex-1 relative z-[1]">
                <h3
                  className="font-comic text-xl tracking-wide"
                  style={{ color: "var(--color-comic-yellow)" }}
                >
                  CONTACT INFO
                </h3>

                {/* Email */}
                <div className="space-y-1">
                  <p
                    className="font-comic text-xs tracking-wider"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    EMAIL
                  </p>
                  <a
                    className="font-comic-body font-bold inline-block transition-transform hover:translate-x-1"
                    href={`mailto:${personalInfo.email}`}
                    style={{ color: "var(--color-comic-blue)" }}
                  >
                    {personalInfo.email}
                  </a>
                </div>

                {/* Phone */}
                {personalInfo.phone && (
                  <div className="space-y-1">
                    <p
                      className="font-comic text-xs tracking-wider"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      PHONE
                    </p>
                    <a
                      className="font-comic-body font-bold inline-block transition-transform hover:translate-x-1"
                      href={`tel:${personalInfo.phone}`}
                      style={{ color: "var(--color-comic-blue)" }}
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                )}

                {/* Location */}
                <div className="space-y-1">
                  <p
                    className="font-comic text-xs tracking-wider"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    LOCATION
                  </p>
                  <p
                    className="font-comic-body font-bold"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    📍 {personalInfo.location}
                  </p>
                </div>

                {/* Social links */}
                <div className="flex gap-3 pt-2">
                  {personalInfo.linkedin && (
                    <a
                      className="comic-btn comic-btn-primary text-sm"
                      href={personalInfo.linkedin}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      LINKEDIN
                    </a>
                  )}
                  {personalInfo.github && (
                    <a
                      className="comic-btn comic-btn-secondary text-sm"
                      href={personalInfo.github}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      GITHUB
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            className="w-full md:w-[calc(50%-16px)] max-w-md flex"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="comic-card w-full flex flex-col">
              {/* Panel label */}
              <div
                className="absolute top-3 left-3 px-2 py-0.5 font-comic text-xs z-[2]"
                style={{
                  background: "var(--color-comic-orange)",
                  color: "var(--color-comic-ink)",
                  border: "2px solid var(--color-comic-ink)",
                }}
              >
                ✉️ MESSAGE
              </div>

              <form
                className="pt-8 space-y-4 flex flex-col flex-1 relative z-[1]"
                onSubmit={handleSubmit}
              >
                {/* Name input */}
                <div>
                  <label
                    className="font-comic text-xs tracking-wider block mb-1"
                    htmlFor="contact-name"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    NAME *
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 font-comic-body font-bold rounded-none outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px]"
                    id="contact-name"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "2px solid var(--color-comic-ink)",
                      boxShadow: "2px 2px 0px var(--color-comic-ink)",
                      color: "white",
                    }}
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Email input */}
                <div>
                  <label
                    className="font-comic text-xs tracking-wider block mb-1"
                    htmlFor="contact-email"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    EMAIL *
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 font-comic-body font-bold rounded-none outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px]"
                    id="contact-email"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "2px solid var(--color-comic-ink)",
                      boxShadow: "2px 2px 0px var(--color-comic-ink)",
                      color: "white",
                    }}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Message textarea */}
                <div className="flex-1 flex flex-col">
                  <label
                    className="font-comic text-xs tracking-wider block mb-1"
                    htmlFor="contact-message"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    MESSAGE *
                  </label>
                  <textarea
                    required
                    className="w-full px-4 py-2.5 font-comic-body font-bold rounded-none outline-none resize-none flex-1 min-h-[120px] transition-all focus:translate-x-[-2px] focus:translate-y-[-2px]"
                    id="contact-message"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "2px solid var(--color-comic-ink)",
                      boxShadow: "2px 2px 0px var(--color-comic-ink)",
                      color: "white",
                    }}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                {/* Submit */}
                <button
                  className="comic-btn comic-btn-primary w-full mt-auto"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "SENDING..." : "SEND MESSAGE 💬"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
