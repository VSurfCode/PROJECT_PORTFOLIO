import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { NeonButton, NeonText } from "@/components/ui";
import { Link } from "@heroui/link";
import { supabase } from "@/lib/supabase/client";
import type { PersonalInfo } from "@/types/portfolio";
import { motion } from "motion/react";
import HeroImageReveal from "./HeroImageReveal";

export default function HeroSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVibeSelect = (vibe: "recruiter" | "engineer" | "chaos") => {
    switch (vibe) {
      case "recruiter":
        scrollToSection("experience");
        break;
      case "engineer":
        scrollToSection("projects");
        break;
      case "chaos":
        scrollToSection("projects");
        break;
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen py-20">
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  if (!personalInfo) {
    return null;
  }

  return (
    <section
      ref={sectionRef as any}
      className="relative flex flex-col items-center justify-center min-h-screen py-20 px-6 overflow-hidden"
    >
      {/* <HeroImageReveal
        targetRef={sectionRef as any}
        fromSrc="/me2.png"
        toSrc="/meeon.png"
      /> */}

      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-7xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <NeonText intensity="medium" size="3xl" as="span">
            {personalInfo.name}
          </NeonText>
        </motion.h1>
        <motion.p
          className="text-2xl md:text-3xl text-default-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {personalInfo.title}
        </motion.p>
        <motion.p
          className="text-lg text-default-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {personalInfo.location}
        </motion.p>
        <motion.p
          className="text-base md:text-lg max-w-2xl mx-auto text-default-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {personalInfo.summary}
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {personalInfo.linkedin && (
            <Link href={personalInfo.linkedin} isExternal>
              <NeonButton variant="bordered" glow>
                LinkedIn
              </NeonButton>
            </Link>
          )}
          {personalInfo.github && (
            <Link href={personalInfo.github} isExternal>
              <NeonButton variant="bordered" glow>
                GitHub
              </NeonButton>
            </Link>
          )}
          <NeonButton
            variant="bordered"
            glow
            onPress={() => scrollToSection("contact")}
          >
            Contact
          </NeonButton>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-3 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Button
            variant="light"
            size="sm"
            onPress={() => handleVibeSelect("recruiter")}
            className="text-default-500 hover:text-primary transition-colors"
          >
            Recruiter (2 min)
          </Button>
          <Button
            variant="light"
            size="sm"
            onPress={() => handleVibeSelect("engineer")}
            className="text-default-500 hover:text-primary transition-colors"
          >
            Engineer (5 min)
          </Button>
          <Button
            variant="light"
            size="sm"
            onPress={() => handleVibeSelect("chaos")}
            className="text-default-500 hover:text-primary transition-colors"
          >
            Chaos (fun)
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
