import { type HTMLAttributes } from "react";
import { motion } from "framer-motion";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
  onClick,
  ...props
}: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
