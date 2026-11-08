"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGithub as Github,
  FaLinkedin as Linkedin,
  FaEnvelope as Mail,
} from "react-icons/fa";
import { profile } from "@/lib/data";

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

          <motion.ul
            variants={item}
            className="mt-[26px] flex flex-wrap gap-5 border-t border-line pt-[22px]"
          >
            {[
              { href: profile.github, label: "GitHub", Icon: Github },
              { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
              { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14.5px] font-[550] text-ink transition-colors hover:text-accent"
                >
                  <Icon size={14} className="opacity-85" />
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Abstract geometric visual */}
        <motion.div
          ref={cardRef}
          aria-hidden
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-card border border-line bg-elev shadow-card will-change-transform transition-shadow duration-300 hover:shadow-lift lg:max-w-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* soft accent glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_26%,var(--accent-soft),transparent_62%)] opacity-80" />

          <svg viewBox="0 0 480 480" className="relative h-full w-full" role="presentation">
            <defs>
              <pattern id="hvGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M30 0H0V30"
                  fill="none"
                  stroke="#808080"
                  strokeOpacity="0.16"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* technical grid */}
            <rect width="480" height="480" fill="url(#hvGrid)" />

            {/* inner disc for depth */}
            <circle cx="240" cy="240" r="72" style={{ fill: "var(--accent-soft)" }} opacity="0.55" />

            {/* structural rings */}
            <circle
              cx="240"
              cy="240"
              r="158"
              fill="none"
              className="text-line-strong"
              stroke="currentColor"
              strokeOpacity="0.9"
            />
            <circle
              cx="240"
              cy="240"
              r="72"
              fill="none"
              className="text-line"
              stroke="currentColor"
            />
            <rect
              x="150"
              y="150"
              width="180"
              height="180"
              transform="rotate(45 240 240)"
              fill="none"
              className="text-line"
              stroke="currentColor"
              strokeOpacity="0.7"
            />

            {/* rotating dotted ring */}
            <g className="hv-spin" style={{ transformOrigin: "240px 240px" }}>
              <circle
                cx="240"
                cy="240"
                r="118"
                fill="none"
                className="text-line-strong"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="1 11"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
            </g>

            {/* accent arc */}
            <path
              d="M212.9 86.4A156 156 0 0 1 393.6 212.9"
              fill="none"
              style={{ stroke: "var(--accent)" }}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* center crosshair */}
            <g className="text-line-strong" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8">
              <line x1="240" y1="228" x2="240" y2="252" />
              <line x1="228" y1="240" x2="252" y2="240" />
            </g>

            {/* nodes on inner ring */}
            <g className="text-ink" fill="currentColor" opacity="0.9">
              <circle cx="240" cy="168" r="3.2" />
              <circle cx="312" cy="240" r="3.2" />
              <circle cx="240" cy="312" r="3.2" />
              <circle cx="168" cy="240" r="3.2" />
            </g>

            {/* accent node + halo */}
            <circle cx="240" cy="82" r="16" style={{ fill: "var(--accent)" }} opacity="0.18" />
            <circle cx="240" cy="82" r="8" style={{ fill: "var(--accent)" }} className="hv-pulse" />

            {/* corner registration marks */}
            <g className="text-faint" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M28 52V28h24" fill="none" />
              <path d="M452 52V28h-24" fill="none" />
              <path d="M28 428v24h24" fill="none" />
              <path d="M452 428v24h-24" fill="none" />
            </g>
          </svg>

          {/* technical labels */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <i className="block h-1.5 w-1.5 rounded-full bg-accent" />
                System / V2
              </span>
              <span>Fig. 01</span>
            </div>
            <div className="flex items-center justify-between">
              <span>20.29° N</span>
              <span>85.82° E</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
