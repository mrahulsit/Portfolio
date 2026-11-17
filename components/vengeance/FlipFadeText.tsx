"use client";

/**
 * Flip Fade Text — adapted from Vengeance UI (`flip-fade-text`).
 * Cycles through words, flipping each letter in and out in 3D.
 * Holds on the first word for reduced-motion users.
 */
import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const Letter = memo(function Letter({ char }: { char: string }) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: { rotateX: 90, y: 14, opacity: 0, filter: "blur(6px)" },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
        },
        exit: {
          rotateX: -90,
          y: -14,
          opacity: 0,
          filter: "blur(6px)",
          transition: { duration: 0.32, ease: "easeIn" },
        },
      }}
      className="inline-block"
    >
      {char === " " ? " " : char}
    </motion.span>
  );
});

export default function FlipFadeText({
  words,
  interval = 2600,
  className,
  textClassName,
}: {
  words: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  const word = words[index];

  return (
    <span className={cn("relative inline-flex", className)} style={{ perspective: "1000px" }}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          aria-hidden
          className={cn("inline-flex whitespace-nowrap", textClassName)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.04 } },
            exit: { transition: { staggerChildren: 0.02 } },
          }}
        >
          {word.split("").map((c, i) => (
            <Letter key={`${c}-${i}`} char={c} />
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
