"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { experience, profile, projects } from "@/lib/data";
import { TECH_ICONS } from "@/lib/techIcons";
import StaggerText from "@/components/vengeance/StaggerText";
import FlipFadeText from "@/components/vengeance/FlipFadeText";
import StatsCounter from "@/components/vengeance/StatsCounter";
import LogoSlider from "@/components/vengeance/LogoSlider";
import HeroVisual from "./HeroVisual";

gsap.registerPlugin(ScrollTrigger);

const ROLES = ["full-stack products", "React interfaces", "scalable APIs", "AI-powered features"];

export default function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* GSAP: the 3D piece drifts down as the hero scrolls away (desktop only). */
  useEffect(() => {
    if (reduce) return;
    const visual = visualRef.current;
    const hero = heroRef.current;
    if (!visual || !hero) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.to(visual, {
        y: 60,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, [reduce]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  const shipped = projects.filter((p) => p.status === "live").length;
  const titlesHeld = experience[0]?.progression?.length ?? 1;

  return (
    <>
      <section
        ref={heroRef}
        id="home"
        className="relative px-3 pb-3 sm:px-4"
        // The header floats over the top of this panel.
        // Header = 20px top padding + --header-h; the panel starts 12px down.
        style={{ marginTop: "calc(-1 * (var(--header-h) + 8px))" }}
      >
        <div
          className="band-dark hero-grid relative overflow-hidden rounded-[28px] sm:rounded-[36px]"
          style={{ overflowX: "clip" }}
        >
          {/* lime glow + bottom vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] -top-[20%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(185,241,47,0.16),transparent)]"
          />

          {/* Padding lives on this wrapper: the global .shell rule would override it. */}
          <div className="relative z-10 pb-10 pt-[calc(var(--header-h)+72px)] lg:pb-14 lg:pt-[calc(var(--header-h)+80px)]">
          <div className="shell grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
            <div className="min-w-0">
              {profile.availability.open && (
                <motion.p
                  {...fade(0)}
                  className="mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-[650] text-accent-text"
                >
                  <span className="avail-dot text-teal" aria-hidden />
                  <span className="sm:hidden">{profile.availability.shortLabel}</span>
                  <span className="hidden sm:inline">{profile.availability.openLabel}</span>
                </motion.p>
              )}

              <h1 className="font-display font-semibold leading-[0.84] tracking-[-0.055em] text-ink">
                <span className="block text-[clamp(72px,13vw,172px)]">
                  <StaggerText text="Rahul" divideBy="letter" onView={false} delay={0.1} />
                </span>
                <span className="block text-[clamp(72px,13vw,172px)]">
                  <StaggerText text="Mishra" divideBy="letter" onView={false} delay={0.25} />
                  <span className="text-lime">.</span>
                </span>
              </h1>

              <motion.p
                {...fade(0.55)}
                className="mt-8 flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(22px,3vw,32px)] font-medium leading-tight tracking-[-0.02em] text-ink"
              >
                <span>I build</span>
                <FlipFadeText words={ROLES} textClassName="text-lime" />
              </motion.p>

              <motion.p
                {...fade(0.7)}
                className="mt-5 max-w-[34em] text-[clamp(16px,1.6vw,18px)] leading-relaxed text-ink-2"
              >
                {profile.lede}
              </motion.p>

              <motion.div {...fade(0.85)} className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent py-3 pl-6 pr-3 text-[15px] font-[650] text-accent-text transition-transform duration-200 hover:-translate-y-0.5"
                >
                  See my work
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-teal text-lime transition-transform duration-300 group-hover:rotate-[-45deg]">
                    <FiArrowDownRight size={16} aria-hidden />
                  </span>
                </Link>
                <Link
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-[15px] font-[600] text-ink transition-colors duration-200 hover:border-lime hover:text-lime"
                >
                  Résumé
                  <FiArrowUpRight size={15} aria-hidden />
                </Link>
              </motion.div>
            </div>

            {/* 3D full-stack visual */}
            <motion.div
              ref={visualRef}
              aria-hidden
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="relative mx-auto aspect-square w-full max-w-[520px] will-change-transform max-lg:max-w-[420px] lg:max-w-none"
            >
              <HeroVisual />
            </motion.div>
          </div>
          </div>

          {/* Stat strip */}
          <div className="relative z-10 border-t border-line">
            <div className="shell">
              <dl className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
                {[
                  {
                    k: <StatsCounter value={Number(profile.experienceYears)} decimals={1} suffix=" yrs" />,
                    v: "Professional experience",
                  },
                  {
                    k: <StatsCounter value={titlesHeld} />,
                    v: `Roles at ${experience[0]?.org.split(" ")[0] ?? "work"}`,
                  },
                  { k: <StatsCounter value={shipped} />, v: "Products shipped" },
                  { k: "Now", v: "Available to join" },
                ].map((s, i) => (
                  <div
                    key={s.v}
                    className={`flex flex-col bg-bg py-6 max-sm:py-5 ${i % 2 === 1 ? "pl-6" : "pr-4"} ${
                      i === 2 ? "lg:pl-6" : ""
                    }`}
                  >
                    <dt className="kicker order-2 mt-2 text-faint">{s.v}</dt>
                    <dd className="font-display text-[clamp(26px,3vw,36px)] font-semibold leading-none tracking-[-0.03em] text-ink">
                      {s.k}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Lime tech marquee */}
      <div className="relative z-10 -mx-2 my-10 -rotate-[1.2deg] bg-accent py-4 text-accent-text max-sm:my-6">
        <LogoSlider
          label="Technologies I work with"
          speed={45}
          items={TECH_ICONS.map((t) => (
            <span key={t.name} className="flex items-center gap-3 px-7">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden className="fill-teal">
                <path d={t.path} />
              </svg>
              <span className="whitespace-nowrap font-display text-[22px] font-semibold tracking-[-0.02em]">
                {t.name}
              </span>
              <span aria-hidden className="ml-7 text-[18px]">
                ✦
              </span>
            </span>
          ))}
        />
      </div>
    </>
  );
}
