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
import { contents, profile } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const btnAccent =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent border border-accent px-[18px] py-2.5 text-[14.5px] font-[550] text-white transition-all duration-200 hover:-translate-y-[3px] hover:bg-accent-ink hover:border-accent-ink hover:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.5)]";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-[18px] py-2.5 text-[14.5px] font-[550] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_4px_16px_-8px_rgba(79,70,229,0.3)]";

export default function Hero() {
  const cardRef = useRef<HTMLElement>(null);
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
            className="mb-3 font-display text-[clamp(52px,9vw,92px)] font-medium leading-[0.98] tracking-[-0.03em] text-ink"
          >
            Rahul
            <br />
            Mishra
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

        {/* Editorial index / contents card */}
        <motion.aside
          ref={cardRef}
          aria-label="Contents"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="max-w-[480px] overflow-hidden rounded-card border border-line bg-elev shadow-card will-change-transform transition-shadow duration-300 hover:shadow-lift lg:max-w-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center justify-between border-b border-line px-[22px] py-4 text-xs font-semibold uppercase tracking-[0.12em] text-faint">
            <span>Contents</span>
            <span aria-hidden className="flex gap-1.5">
              <i className="block h-2.5 w-2.5 rounded-full bg-accent" />
              <i className="block h-2.5 w-2.5 rounded-full bg-line-strong" />
              <i className="block h-2.5 w-2.5 rounded-full bg-line-strong" />
            </span>
          </div>
          <nav className="py-2">
            {contents.map((c) => (
              <Link
                key={c.n}
                href={c.href}
                className="flex items-baseline gap-4 border-b border-line px-[22px] py-[13px] font-display text-xl text-ink transition-all duration-200 last:border-b-0 hover:bg-sink hover:pl-7 hover:text-accent"
              >
                <b className="font-ui text-xs font-semibold tracking-[0.08em] text-faint transition-colors hover:text-accent">
                  {c.n}
                </b>
                <span>{c.label}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>
      </div>
    </section>
  );
}
