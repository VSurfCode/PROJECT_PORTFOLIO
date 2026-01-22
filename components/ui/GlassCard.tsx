import { ReactNode } from "react";
import { Card, CardProps } from "@heroui/card";
import { tv } from "tailwind-variants";
import { motion } from "motion/react";

const glassCardVariants = tv({
  base: "glass-card",
  variants: {
    hover: {
      true: "glass-card-hover",
      false: "",
    },
    glow: {
      true: "neon-glow",
      false: "",
    },
  },
  defaultVariants: {
    hover: false,
    glow: false,
  },
});

interface GlassCardProps extends CardProps {
  hover?: boolean;
  glow?: boolean;
  children: ReactNode;
}

export default function GlassCard({
  hover = false,
  glow = false,
  children,
  className,
  ...props
}: GlassCardProps) {
  const cardContent = (
    <Card
      className={glassCardVariants({ hover, glow, className })}
      {...props}
    >
      {children}
    </Card>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
