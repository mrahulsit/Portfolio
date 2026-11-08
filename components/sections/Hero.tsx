"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";
import HeroVisual from "./HeroVisual";

gsap.registerPlugin(ScrollTrigger);

const btnAccent =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent border border-accent px-[18px] py-2.5 text-[14.5px] font-[550] text-accent-text transition-all duration-200 hover:-translate-y-[3px] hover:bg-accent-ink hover:border-accent-ink hover:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.5)]";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-[18px] py-2.5 text-[14.5px] font-[550] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_4px_16px_-8px_rgba(79,70,229,0.3)]";

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* GSAP: index-card parallax on scroll (desktop only, reduced-motion aware) */
  useEffect(() => {
    if (reduce) return;
    const card = cardRef.current;
    const hero = heroRef.current;
    if (!card || !hero) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.to(card, {
        y: 40,
        z: -30,
        rotateX: -3,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, [reduce]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section ref={heroRef} id="home" className="pb-10 pt-[92px] max-sm:pt-16">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-[60px] [perspective:1200px]">
        <motion.div variants={container} initial="hidden" animate="show">
          {profile.availability.open && (
            <motion.p
              variants={item}
              className="mb-[26px] inline-flex items-center gap-2.5 rounded-full border border-[#CDF22B]/60 bg-[#CDF22B]/20 px-4 py-2 text-[13px] font-[650] tracking-[0.01em] text-[#08090B]"
            >
              <span className="avail-dot" aria-hidden />
              {profile.availability.openLabel}
            </motion.p>
          )}

          <motion.h1
            variants={item}
            className="mb-3 whitespace-nowrap font-display text-[clamp(44px,7.5vw,76px)] font-medium leading-[1] tracking-[-0.03em] text-ink max-sm:text-[clamp(36px,11vw,52px)]"
          >
            Rahul Mishra
          </motion.h1>

          <motion.p
            variants={item}
            className="mb-4 font-display text-[clamp(21px,3vw,28px)] font-medium tracking-tight text-ink"
          >
            {profile.eyebrow}
          </motion.p>

          <motion.p
            variants={item}
            className="mb-4 font-display text-[clamp(18px,2.6vw,23px)] font-normal italic leading-snug text-muted"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            variants={item}
            className="mb-7 max-w-[34em] text-[clamp(16.5px,2vw,18.5px)] leading-relaxed text-ink"
          >
            {profile.lede}
          </motion.p>

          <motion.ul variants={item} className="mb-8 flex flex-wrap gap-2.5">
            {profile.heroChips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line-strong bg-elev px-3.5 py-1.5 text-[13px] font-[550] text-ink-2"
              >
                {c}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="flex flex-wrap gap-3.5">
            <Link href="#projects" className={btnAccent}>
              Explore Projects
            </Link>
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className={btnGhost}
            >
              Download Resume
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D full-stack visual (open, no frame) */}
        <motion.div
          ref={cardRef}
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="relative mx-auto aspect-square w-full max-w-[520px] will-change-transform lg:max-w-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* soft ambient glow behind the model */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,var(--accent-soft),transparent_60%)] opacity-60" />

          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
