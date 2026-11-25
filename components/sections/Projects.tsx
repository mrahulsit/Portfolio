"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactElement } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import SectionHead from "@/components/ui/SectionHead";
import Tag from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/data";

/* ---------- inline mockup screens ---------- */
function CinePulseScreen() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#0d1117" width="400" height="240" />
      <rect fill="#161b22" width="400" height="44" />
      <circle fill="#ff5f56" cx="12" cy="22" r="3" />
      <circle fill="#ffbd2e" cx="20" cy="22" r="3" />
      <circle fill="#27ca3f" cx="28" cy="22" r="3" />
      <rect fill="#21262d" x="60" y="12" width="150" height="20" rx="10" opacity="0.7" />
      <rect fill="#161b22" x="20" y="56" width="360" height="38" rx="8" />
      <rect fill="#30363d" x="34" y="66" width="120" height="16" rx="4" opacity="0.8" />
      <rect fill="#30363d" x="164" y="66" width="60" height="16" rx="4" opacity="0.8" />
      <rect fill="#161b22" x="20" y="104" width="116" height="118" rx="10" />
      <rect fill="#1a1f2e" x="28" y="112" width="100" height="78" rx="6" />
      <rect fill="#B9F12F" x="28" y="112" width="100" height="10" rx="4" opacity="0.55" />
      <rect fill="#30363d" x="28" y="196" width="60" height="8" rx="4" />
      <rect fill="#30363d" x="96" y="196" width="36" height="8" rx="4" />
      <rect fill="#161b22" x="156" y="104" width="116" height="118" rx="10" />
      <rect fill="#1a1f2e" x="164" y="112" width="100" height="78" rx="6" />
      <rect fill="#B9F12F" x="164" y="112" width="100" height="10" rx="4" opacity="0.4" />
      <rect fill="#30363d" x="164" y="196" width="56" height="8" rx="4" />
      <rect fill="#30363d" x="228" y="196" width="36" height="8" rx="4" />
      <rect fill="#161b22" x="20" y="220" width="360" height="20" rx="10" />
      <circle fill="#30363d" cx="30" cy="230" r="6" />
      <rect fill="#30363d" x="46" y="226" width="70" height="8" rx="4" opacity="0.8" />
      <rect fill="#30363d" x="122" y="226" width="60" height="8" rx="4" opacity="0.6" />
    </svg>
  );
}

function PharmacyScreen() {
  return (
    <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#fafbfc" width="300" height="180" />
      <rect fill="#e2e8f0" width="300" height="44" />
      <rect fill="#cbd5e1" x="24" y="16" width="28" height="12" rx="6" />
      <rect fill="#e2e8f0" x="60" y="15" width="130" height="14" rx="7" opacity="0.9" />
      <rect fill="#e2e8f0" x="200" y="15" width="76" height="14" rx="7" opacity="0.6" />
      <rect fill="#ffffff" x="20" y="62" width="80" height="92" rx="10" stroke="#e5e7eb" strokeWidth="1" />
      <rect fill="#e5e7eb" x="28" y="72" width="64" height="48" rx="8" />
      <rect fill="#94a3b8" x="28" y="126" width="56" height="10" rx="5" />
      <rect fill="#e5e7eb" x="28" y="142" width="40" height="8" rx="4" />
      <rect fill="#ffffff" x="112" y="62" width="80" height="92" rx="10" stroke="#e5e7eb" strokeWidth="1" />
      <rect fill="#e5e7eb" x="120" y="72" width="64" height="48" rx="8" />
      <rect fill="#94a3b8" x="120" y="126" width="56" height="10" rx="5" />
      <rect fill="#e5e7eb" x="120" y="142" width="40" height="8" rx="4" />
      <rect fill="#ffffff" x="204" y="62" width="76" height="92" rx="10" stroke="#e5e7eb" strokeWidth="1" />
      <rect fill="#e5e7eb" x="212" y="72" width="60" height="48" rx="8" />
      <rect fill="#94a3b8" x="212" y="126" width="56" height="10" rx="5" />
      <rect fill="#e5e7eb" x="212" y="142" width="40" height="8" rx="4" />
      <rect fill="#f1f5f9" x="20" y="160" width="260" height="12" rx="6" />
    </svg>
  );
}

function WorkTrackScreen() {
  return (
    <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#0d1117" width="300" height="180" />
      <rect fill="#161b22" width="56" height="180" />
      <rect fill="#30363d" x="20" y="24" width="16" height="16" rx="4" />
      <rect fill="#30363d" x="20" y="52" width="16" height="4" rx="2" />
      <rect fill="#30363d" x="20" y="64" width="16" height="4" rx="2" />
      <rect fill="#161b22" x="72" y="24" width="208" height="72" rx="10" />
      <rect fill="#B9F12F" x="92" y="36" width="120" height="32" rx="8" opacity="0.25" />
      <rect fill="#30363d" x="92" y="76" width="80" height="8" rx="4" />
      <rect fill="#161b22" x="72" y="108" width="208" height="48" rx="10" />
      <rect fill="#B9F12F" x="92" y="118" width="110" height="24" rx="6" opacity="0.25" />
      <circle cx="104" cy="132" r="5" fill="#30363d" />
      <rect fill="#30363d" x="92" y="146" width="64" height="8" rx="4" />
    </svg>
  );
}

function GeminiScreen() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#0d1117" width="400" height="240" />
      <rect fill="#161b22" width="400" height="44" />
      <circle fill="#ff5f56" cx="12" cy="22" r="3" />
      <circle fill="#ffbd2e" cx="20" cy="22" r="3" />
      <circle fill="#27ca3f" cx="28" cy="22" r="3" />
      <rect fill="#21262d" x="60" y="12" width="150" height="20" rx="10" opacity="0.7" />
      <rect fill="#30363d" x="24" y="72" width="180" height="34" rx="10" />
      <rect fill="#B9F12F" x="196" y="80" width="170" height="34" rx="10" opacity="0.9" />
      <rect fill="#30363d" x="24" y="132" width="220" height="34" rx="10" />
      <rect fill="#B9F12F" x="170" y="148" width="196" height="34" rx="10" opacity="0.85" />
      <rect fill="#161b22" x="24" y="200" width="352" height="36" rx="18" />
      <rect fill="#30363d" x="36" y="210" width="240" height="16" rx="8" opacity="0.8" />
      <rect fill="#30363d" x="286" y="210" width="24" height="24" rx="6" />
    </svg>
  );
}

function ChatbotScreen() {
  return (
    <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#fafbfc" width="300" height="180" />
      <rect fill="#e2e8f0" width="300" height="44" />
      <rect fill="#cbd5e1" x="24" y="16" width="26" height="12" rx="6" />
      <rect fill="#e2e8f0" x="60" y="15" width="110" height="14" rx="7" opacity="0.9" />
      <rect fill="#e2e8f0" x="240" y="15" width="36" height="14" rx="7" opacity="0.6" />
      <rect fill="#ffffff" x="16" y="64" width="150" height="30" rx="10" />
      <rect fill="#e2e8f0" x="24" y="72" width="100" height="14" rx="7" />
      <rect fill="#B9F12F" x="134" y="70" width="150" height="34" rx="10" opacity="0.9" />
      <rect fill="#ffffff" x="16" y="112" width="140" height="30" rx="10" />
      <rect fill="#e2e8f0" x="24" y="120" width="92" height="14" rx="7" />
      <rect fill="#eaf8c4" x="24" y="156" width="252" height="24" rx="12" />
      <rect fill="#B9F12F" x="32" y="162" width="120" height="12" rx="6" />
    </svg>
  );
}

const mockups = {
  cinepulse: CinePulseScreen,
  pharmacy: PharmacyScreen,
  worktrack: WorkTrackScreen,
  gemini: GeminiScreen,
  chatbot: ChatbotScreen,
} as const;

/* ---------- shared card bits ---------- */
const ease =
  "transition-[border-color,background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(.25,.8,.25,1)]";

export function StatusBadge({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const live = project.status === "live";
  return (
    <span
      className={`kicker inline-flex items-center gap-2 ${
        live ? "text-ink" : "text-faint"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          live ? "bg-lime shadow-[0_0_0_3px_rgba(185,241,47,0.25)]" : "border border-faint"
        }`}
      />
      {project.statusLabel}
    </span>
  );
}

export function ProjectScreen({
  project,
  compact = false,
  className = "",
}: {
  project: Project;
  compact?: boolean;
  className?: string;
}) {
  const Screen = mockups[project.mockup];
  return (
    <div
      className={`relative flex items-center justify-center bg-[radial-gradient(130%_120%_at_50%_-10%,var(--bg-sink),var(--bg)_70%)] ${
        compact ? "px-4 py-5 sm:px-5 sm:py-6" : "px-6 py-9 sm:px-12 sm:py-14"
      } ${className}`}
    >
      <div
        className={`w-full overflow-hidden rounded-xl border border-line-strong/70 bg-bg shadow-card ${
          // Real screenshots get more room on detail pages than the drawn mockups.
          compact ? "max-w-[360px]" : project.image ? "max-w-[760px]" : "max-w-[440px]"
        } ${ease} group-hover:border-line-strong`}
      >
        <div className="relative aspect-[16/10] w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} interface screenshot`}
              fill
              sizes={compact ? "(max-width: 768px) 90vw, 360px" : "(max-width: 1024px) 90vw, 760px"}
              className="object-cover object-top"
            />
          ) : (
            <Screen />
          )}
        </div>
      </div>
    </div>
  );
}

export function TechList({
  tech,
  className = "",
}: {
  tech: Project["tech"];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tech.map((t) => (
        <li key={t.label}>
          <Tag size="sm" variant={t.kind === "muted" ? "muted" : "neutral"}>
            {t.label}
          </Tag>
        </li>
      ))}
    </ul>
  );
}


export function ActionRow({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const buttonCls =
    "group/link inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink transition-colors duration-200 hover:border-lime hover:bg-lime hover:text-teal";

  const items: ReactElement[] = [];

  if (project.caseStudy) {
    items.push(
      <Link key="case-study" href={`/projects/${project.caseStudy}`} className={buttonCls}>
        Details{" "}
        <FaArrowRight
          size={9}
          aria-hidden
          className="transition-transform duration-200 group-hover/link:translate-x-0.5"
        />
      </Link>,
    );
  }

  const live = project.actions?.find((a) => a.label.toLowerCase() === "live demo");
  if (live) {
    items.push(
      <a
        key="live"
        href={live.href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonCls}
      >
        Live <FaExternalLinkAlt size={9} aria-hidden />
      </a>,
    );
  }

  const code = project.actions?.find(
    (a) => a.label.toLowerCase() === "source" || a.href.includes("github"),
  );
  if (code) {
    items.push(
      <a
        key="code"
        href={code.href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonCls}
      >
        Code <FaGithub size={10} aria-hidden />
      </a>,
    );
  }

  if (!items.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>{items}</div>
  );
}

/* ---------- section ---------- */

/** Where a row's main link goes: the case study if there is one, else the live demo. */
function primaryHref(p: Project) {
  if (p.caseStudy) return `/projects/${p.caseStudy}`;
  return p.actions?.find((a) => a.label.toLowerCase() === "live demo")?.href ?? "/projects";
}

/**
 * Editorial project index — adapted from Vengeance UI's Image Reveal List and
 * Cursor Card: big numbered rows, a lime curtain on hover, and a screenshot
 * card that springs after the cursor (pointer devices only; touch screens get
 * the screenshot inline in each row).
 */
function ProjectIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 26, stiffness: 260 });
  const sy = useSpring(y, { damping: 26, stiffness: 260 });

  useEffect(() => {
    const q = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const read = () => setCanHover(q.matches);
    read();
    q.addEventListener("change", read);
    return () => q.removeEventListener("change", read);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 56);
    y.set(e.clientY - 150);
  };

  return (
    <div onMouseMove={canHover ? onMove : undefined} onMouseLeave={() => setHovered(null)}>
      <ol className="m-0 list-none border-b border-line p-0">
        {projects.map((p, i) => {
          const href = primaryHref(p);
          const external = href.startsWith("http");
          return (
            <Reveal as="li" key={p.id} delay={i * 0.05} className="group relative border-t border-line">
              <div
                onMouseEnter={() => setHovered(i)}
                className="relative isolate grid gap-5 py-8 lg:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1fr)_150px] lg:items-center lg:gap-8 lg:py-9"
              >
                {/* lime curtain */}
                <span
                  aria-hidden
                  className="absolute inset-x-[-12px] inset-y-0 -z-10 origin-bottom scale-y-0 rounded-[18px] bg-lime transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:group-hover:scale-y-100"
                />

                {/* Inline screenshot on touch / small screens */}
                <ProjectScreen project={p} compact className="rounded-[18px] border border-line lg:hidden" />

                <span className="kicker tabular-nums text-faint transition-colors duration-300 lg:group-hover:text-teal/60">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(34px,5vw,64px)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:group-hover:translate-x-2 lg:group-hover:text-teal">
                    {/* The title link stretches over the whole row. */}
                    <Link
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="stretched-link outline-none focus-visible:underline"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15px] font-[550] text-accent-strong transition-colors duration-300 lg:group-hover:text-teal">
                    {p.subtitle}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-4 line-clamp-3 text-[14px] leading-relaxed text-ink-2 transition-colors duration-300 lg:group-hover:text-teal/80">
                    {p.desc}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <li
                        key={t.label}
                        className="rounded-full border border-line-strong px-2.5 py-1 text-[11.5px] font-[550] leading-none text-ink-2 transition-colors duration-300 lg:group-hover:border-teal/30 lg:group-hover:text-teal"
                      >
                        {t.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                  <StatusBadge project={p} className="transition-colors duration-300 lg:group-hover:text-teal" />
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong text-ink transition-all duration-500 lg:group-hover:rotate-[-45deg] lg:group-hover:border-teal lg:group-hover:bg-teal lg:group-hover:text-lime">
                    <FaArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>

      {/* Cursor-following preview */}
      <AnimatePresence>
        {canHover && hovered !== null && (
          <motion.div
            key="preview"
            aria-hidden
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.85, rotate: -6 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            style={{ x: sx, y: sy }}
            className="pointer-events-none fixed left-0 top-0 z-[90] w-[380px] overflow-hidden rounded-[20px] border-4 border-teal bg-teal shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={projects[hovered].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectScreen project={projects[hovered]} compact className="!p-3" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const live = projects.filter((p) => p.status === "live").length;
  const design = projects.filter((p) => p.status === "design").length;
  return (
    <section id="projects" className="px-3 sm:px-4">
      <div className="band-dark topo-dark relative overflow-hidden rounded-[28px] py-24 max-sm:py-16 sm:rounded-[36px]">
        <div className="shell relative">
          <SectionHead
            index="03"
            label="Projects"
            meta={`${live} shipped${design ? ` · ${design} in design` : ""}`}
            title="Things I've engineered."
            lede="Full-stack applications from data model to interface, including AI products. Hover a row for a look; open one for the full case study."
          />

          <ProjectIndex />

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-[14px] font-[650] text-teal transition-transform duration-200 hover:-translate-y-0.5"
            >
              All projects &amp; case studies
              <FaArrowRight size={11} aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-muted">
              <span aria-hidden className="kicker mr-2 text-lime">
                psst
              </span>
              Type <code>sudo hire rahul</code> anywhere on this page and press Enter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
