import type { PersonalInfo } from "@/types/portfolio";

import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { motion } from "motion/react";

import { GlassCard, NeonButton } from "@/components/ui";
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
          <div className="animate-pulse text-center">
            Loading contact info...
          </div>
        </div>
      </section>
    );
  }

  if (!personalInfo) {
    return null;
  }

  return (
    <section className="py-20 px-6" id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Get In Touch
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-8 items-stretch">
          <motion.div
            className="w-full md:w-[calc(50%-16px)] max-w-md flex"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <GlassCard
              className="w-full flex flex-col min-h-full"
              glow={false}
              hover={false}
            >
              <div className="p-6 space-y-4 flex flex-col flex-1">
                <h3 className="text-2xl font-semibold">Contact Information</h3>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm text-default-500">Email</p>
                    <a
                      className="text-primary hover:underline"
                      href={`mailto:${personalInfo.email}`}
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  {personalInfo.phone && (
                    <div>
                      <p className="text-sm text-default-500">Phone</p>
                      <a
                        className="text-primary hover:underline"
                        href={`tel:${personalInfo.phone}`}
                      >
                        {personalInfo.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-default-500">Location</p>
                    <p className="text-default-700">{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          <motion.div
            className="w-full md:w-[calc(50%-16px)] max-w-md flex"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: false, margin: "-50px" }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <GlassCard
              className="w-full flex flex-col min-h-full"
              glow={false}
              hover={false}
            >
              <form
                className="p-6 space-y-4 flex flex-col flex-1"
                onSubmit={handleSubmit}
              >
                <Input
                  isRequired
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  isRequired
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  label="Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  {...({ multiline: true, minRows: 4 } as any)}
                  isRequired
                />
                <NeonButton
                  glow
                  className="w-full mt-auto"
                  isLoading={submitting}
                  type="submit"
                >
                  Send Message
                </NeonButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
