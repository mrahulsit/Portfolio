"use client";

import { PiStarFourFill } from "react-icons/pi";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

/** Rahul's local time (IST), client-only to avoid a hydration mismatch. */
function useIST() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const time = useIST();

  /* GSAP: the giant name slides left and the stack sinks as the hero scrolls away. */
  useEffect(() => {
    if (reduce) return;
    const hero = heroRef.current;
    if (!hero) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      if (nameRef.current) gsap.to(nameRef.current, { xPercent: -6, ease: "none", scrollTrigger: st });
      if (visualRef.current) gsap.to(visualRef.current, { y: 50, ease: "none", scrollTrigger: st });
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
        // Header = 20px top padding + --header-h; the panel starts 12px down.
        style={{ marginTop: "calc(-1 * (var(--header-h) + 8px))" }}
      >
        <div
          className="band-dark topo-dark relative overflow-hidden rounded-[28px] sm:rounded-[36px]"
          style={{ overflowX: "clip" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] top-[20%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(185,241,47,0.13),transparent)]"
          />

          {/* Padding lives on this wrapper: the global .shell rule would override it. */}
          <div className="relative z-10 pb-6 pt-[calc(var(--header-h)+56px)] lg:pt-[calc(var(--header-h)+64px)]">
            <div className="shell">
              {/* Meta row */}
              <motion.div
                {...fade(0)}
                className="mb-6 flex flex-wrap items-center justify-between gap-3"
              >
                {profile.availability.open && (
                  <p className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-[650] text-accent-text">
                    <span className="avail-dot text-teal" aria-hidden />
                    <span className="sm:hidden">{profile.availability.shortLabel}</span>
                    <span className="hidden sm:inline">{profile.availability.openLabel}</span>
                  </p>
                )}
                <p className="kicker hidden text-faint sm:block">
                  {profile.location}
                  {time && <span className="text-ink-2"> · {time} IST</span>}
                </p>
              </motion.div>

              {/* Edge-to-edge name */}
              <h1
                ref={nameRef}
                className="whitespace-nowrap font-display font-bold leading-[0.82] tracking-[-0.065em] text-ink"
                // The name is ~5.7em wide: fit it to the panel width (viewport minus
                // ~98px of gutters and scrollbar), capped at the 1160px shell.
                style={{ fontSize: "min(calc(17.39vw - 17px), 192px)" }}
              >
                <StaggerText text="Rahul Mishra" divideBy="letter" onView={false} delay={0.1} />
                <span className="text-lime">.</span>
              </h1>

              <div className="mt-10 grid items-center gap-6 lg:mt-6 lg:grid-cols-[1fr_1.05fr]">
                <div className="min-w-0">
                  <motion.p
                    {...fade(0.55)}
                    className="flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(22px,2.8vw,32px)] font-medium leading-tight tracking-[-0.02em] text-ink"
                  >
                    <span>I build</span>
                    <FlipFadeText words={ROLES} textClassName="text-lime" />
                  </motion.p>

                  <motion.p
                    {...fade(0.7)}
                    className="mt-5 max-w-[32em] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-ink-2"
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

                {/* 3D: the full stack, layer by layer */}
                <motion.div
                  ref={visualRef}
                  aria-hidden
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                  className="relative mx-auto aspect-square w-full max-w-[560px] will-change-transform"
                >
                  <HeroVisual />
                </motion.div>
              </div>
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

      {/* Lime tech marquee — tilted and slightly wider than the page, so its
          ends are clipped horizontally to avoid sideways scrolling. */}
      <div className="overflow-x-clip py-2">
      <div className="relative z-10 -mx-2 my-8 -rotate-[1.2deg] bg-accent py-4 text-accent-text max-sm:my-4">
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
                <PiStarFourFill aria-hidden size="1em" />
              </span>
            </span>
          ))}
        />
      </div>
      </div>
    </>
  );
}
