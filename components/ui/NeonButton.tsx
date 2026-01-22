import { Button, ButtonProps } from "@heroui/button";
import { motion } from "motion/react";

interface NeonButtonProps extends ButtonProps {
  glow?: boolean;
}

export default function NeonButton({
  glow = false,
  className,
  children,
  ...props
}: NeonButtonProps) {
  const glowClass = glow ? "neon-glow" : "";
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        className={`${glowClass} ${className || ""}`}
        color="primary"
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
