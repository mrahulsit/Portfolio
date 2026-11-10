"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
  id?: string;
  role?: string;
  tabIndex?: number;
} & { [attr: `aria-${string}`]: string | undefined } & {
  [attr: `data-${string}`]: string | boolean | undefined;
};

/** Scroll-reveal wrapper — Framer Motion whileInView with reduced-motion opt-out. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
  ...attrs
}: RevealProps) {
  const reduce = useReducedMotion();
  const tags = {
    div: motion.div,
    li: motion.li,
    article: motion.article,
    section: motion.section,
  } as const;
  const Comp = tags[as] as typeof motion.div;

  return (
    <Comp
      {...attrs}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px", amount: 0.12 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut", delay }}
    >
      {children}
    </Comp>
  );
}
