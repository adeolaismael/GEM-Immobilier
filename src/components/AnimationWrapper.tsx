"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export function AnimationWrapper({ children, delay = 0 }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 16 }
      }
      animate={
        reduceMotion
          ? false
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
