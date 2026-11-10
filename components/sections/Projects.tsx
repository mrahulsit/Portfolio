"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
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
      <rect fill="#CDF22B" x="28" y="112" width="100" height="10" rx="4" opacity="0.55" />
      <rect fill="#30363d" x="28" y="196" width="60" height="8" rx="4" />
      <rect fill="#30363d" x="96" y="196" width="36" height="8" rx="4" />
      <rect fill="#161b22" x="156" y="104" width="116" height="118" rx="10" />
      <rect fill="#1a1f2e" x="164" y="112" width="100" height="78" rx="6" />
      <rect fill="#CDF22B" x="164" y="112" width="100" height="10" rx="4" opacity="0.4" />
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
      <rect fill="#CDF22B" x="92" y="36" width="120" height="32" rx="8" opacity="0.25" />
      <rect fill="#30363d" x="92" y="76" width="80" height="8" rx="4" />
      <rect fill="#161b22" x="72" y="108" width="208" height="48" rx="10" />
      <rect fill="#CDF22B" x="92" y="118" width="110" height="24" rx="6" opacity="0.25" />
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
      <rect fill="#CDF22B" x="196" y="80" width="170" height="34" rx="10" opacity="0.9" />
      <rect fill="#30363d" x="24" y="132" width="220" height="34" rx="10" />
      <rect fill="#CDF22B" x="170" y="148" width="196" height="34" rx="10" opacity="0.85" />
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
      <rect fill="#CDF22B" x="134" y="70" width="150" height="34" rx="10" opacity="0.9" />
      <rect fill="#ffffff" x="16" y="112" width="140" height="30" rx="10" />
      <rect fill="#e2e8f0" x="24" y="120" width="92" height="14" rx="7" />
      <rect fill="#f6fbd6" x="24" y="156" width="252" height="24" rx="12" />
      <rect fill="#dcfc7a" x="32" y="162" width="120" height="12" rx="6" />
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
      className={`inline-flex items-center gap-2 font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] ${
        live ? "text-ink" : "text-faint"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          live ? "bg-accent-strong" : "border border-faint"
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
    "group/link inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 font-ui text-[10.5px] font-[650] uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-bg";

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
export default function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max - el.scrollLeft <= 2);
  };

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-project-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="projects" className="bg-sink py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="Projects"
          meta={`${projects.filter((p) => p.status === "live").length} shipped · ${
            projects.filter((p) => p.status === "design").length
          } in design`}
          title="Things I've engineered."
          lede="Production applications with real deployment pipelines — plus AI interfaces and concepts in design. Each one demonstrates full-stack thinking from data model to user experience."
        />

        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <p className="font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint">
            <span className="text-accent-strong">{projects.length}</span> selected builds · drag to explore
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous project"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:border-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <FaChevronLeft size={11} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next project"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:border-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <FaChevronRight size={11} aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative">
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-sink to-transparent transition-opacity duration-200 md:hidden ${
                atStart ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-sink to-transparent transition-opacity duration-200 md:hidden ${
                atEnd ? "opacity-0" : "opacity-100"
              }`}
            />
            <div
              ref={trackRef}
              onScroll={update}
              role="region"
              aria-roledescription="carousel"
              aria-label="Selected projects"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3"
            >
              {projects.map((p, i) => (
                <Reveal
                  as="article"
                  key={p.id}
                  // Cards fade in one by one, row by row.
                  delay={(i % 3) * 0.08}
                  data-project-card
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${projects.length}: ${p.title}`}
                  className={`group flex w-[80vw] max-w-[330px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border border-line bg-elev sm:w-[330px] md:w-auto md:max-w-none md:shrink ${
                    p.featured ? "md:col-span-2" : ""
                  } ${ease} hover:border-line-strong`}
                >
                  <ProjectScreen project={p} compact className="border-b border-line" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-ui text-[10.5px] font-[650] tabular-nums tracking-[0.16em] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <StatusBadge project={p} />
                    </div>

                    <h3 className="font-display text-[26px] font-medium leading-tight tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mb-3 mt-0.5 text-[14px] font-[550] text-accent-strong">
                      {p.subtitle}
                    </p>
                    <p className="mb-4 text-[13.5px] leading-relaxed text-ink-2">
                      {p.desc}
                    </p>

                    <TechList tech={p.tech.slice(0, 4)} className="mb-5" />

                    {p.note && (
                      <p className="mb-4 font-ui text-[10.5px] font-[600] uppercase tracking-[0.14em] text-faint">
                        {p.note}
                      </p>
                    )}

                    <ActionRow project={p} className="mt-auto" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        <div aria-hidden className="relative mt-1 h-px overflow-hidden bg-line md:hidden">
          <div
            className="absolute inset-y-0 left-0 w-[22%] bg-accent transition-transform duration-200 ease-out"
            style={{ transform: `translateX(${progress * 355}%)` }}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-elev px-5 py-2.5 text-[13.5px] font-[650] text-ink transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-accent-text"
          >
            All projects &amp; case studies
            <FaArrowRight
              size={11}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Easter egg hint */}
        <Reveal className="mt-10 rounded-[18px] border border-dashed border-line-strong px-6 py-5 text-center">
          <p className="text-sm text-muted">
            <span aria-hidden className="mr-1.5 text-accent-strong">
              💡
            </span>
            Curious developer? Type <code>sudo hire rahul</code> anywhere on this page and press
            Enter.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
