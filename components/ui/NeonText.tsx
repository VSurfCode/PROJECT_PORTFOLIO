import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const neonTextVariants = tv({
  base: "neon-accent",
  variants: {
    intensity: {
      subtle: "text-primary",
      medium: "neon-text",
      strong: "neon-text text-shadow-[0_0_10px_rgba(0,255,65,1),0_0_20px_rgba(0,255,65,0.8)]",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
  },
  defaultVariants: {
    intensity: "subtle",
    size: "md",
  },
});

interface NeonTextProps {
  children: ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function NeonText({
  children,
  intensity = "subtle",
  size = "md",
  className,
  as: Component = "span",
}: NeonTextProps) {
  return (
    <Component className={neonTextVariants({ intensity, size, className })}>
      {children}
    </Component>
  );
}
