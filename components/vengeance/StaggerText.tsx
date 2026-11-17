"use client";

/**
 * Stagger Text — adapted from Vengeance UI (`stagger-text`).
 * Words or letters rise out of a clipped line. Reduced-motion aware, and the
 * full string stays available to screen readers.
 */
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function StaggerText({
  text,
  delay = 0,
  divideBy = "word",
  className,
  onView = true,
}: {
  text: string;
  delay?: number;
  divideBy?: "word" | "letter";
  className?: string;
  /** Animate when scrolled into view (default) or immediately on mount. */
  onView?: boolean;
}) {
  const reduce = useReducedMotion();
  const parts = divideBy === "letter" ? text.split("") : text.split(" ");
  const stagger = divideBy === "letter" ? 0.03 : 0.06;

  const trigger = onView
    ? { whileInView: "show" as const, viewport: { once: true, amount: 0.4 } }
    : { animate: "show" as const };

  return (
    <motion.span
      aria-label={text}
      className={className}
      style={{ display: "inline-block" }}
      initial={reduce ? false : "hidden"}
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          aria-hidden
          className="relative inline-block overflow-hidden pb-[0.08em] align-top"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {divideBy === "letter"
              ? part === " "
                ? " "
                : part
              : i < parts.length - 1
                ? part + " "
                : part}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
