import Link from "next/link";
import type { ReactElement } from "react";
import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/data";

/* ---------- inline mockup screens ---------- */
function CinePulseScreen() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#0d1117" width="400" height="240" />
      <rect fill="#1a1f2e" x="20" y="30" width="360" height="40" rx="8" />
      <rect fill="#4f46e5" x="30" y="40" width="80" height="20" rx="4" opacity="0.3" />
      <rect fill="#818cf8" x="120" y="40" width="100" height="20" rx="4" opacity="0.2" />
      <rect fill="#1a1f2e" x="20" y="85" width="170" height="130" rx="8" />
      <rect fill="#1a1f2e" x="205" y="85" width="170" height="130" rx="8" />
      <rect fill="#4f46e5" x="30" y="95" width="150" height="90" rx="6" opacity="0.4" />
      <rect fill="#818cf8" x="215" y="95" width="150" height="90" rx="6" opacity="0.3" />
      <rect fill="#2d3548" x="30" y="190" width="60" height="8" rx="4" />
      <rect fill="#2d3548" x="215" y="190" width="70" height="8" rx="4" />
    </svg>
  );
}

function PharmacyScreen() {
  return (
    <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#fafbfc" width="300" height="180" />
      <rect fill="#4f46e5" x="20" y="20" width="260" height="30" rx="6" opacity="0.15" />
      <rect fill="#e5e7eb" x="20" y="65" width="80" height="80" rx="8" />
      <rect fill="#e5e7eb" x="110" y="65" width="80" height="80" rx="8" />
      <rect fill="#e5e7eb" x="200" y="65" width="80" height="80" rx="8" />
      <rect fill="#4f46e5" x="30" y="150" width="60" height="8" rx="4" opacity="0.3" />
    </svg>
  );
}

function WorkTrackScreen() {
  return (
    <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect fill="#0d1117" width="300" height="180" />
      <line x1="20" y1="30" x2="280" y2="30" stroke="#2d3548" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="20" y1="80" x2="280" y2="80" stroke="#2d3548" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="20" y1="130" x2="280" y2="130" stroke="#2d3548" strokeWidth="1" strokeDasharray="4 2" />
      <rect fill="none" stroke="#4f46e5" strokeWidth="2" x="30" y="40" width="100" height="30" rx="6" opacity="0.6" />
      <rect fill="none" stroke="#818cf8" strokeWidth="2" x="150" y="40" width="120" height="30" rx="6" opacity="0.4" />
      <rect fill="none" stroke="#4f46e5" strokeWidth="2" x="30" y="90" width="240" height="30" rx="6" opacity="0.5" />
      <circle cx="40" cy="55" r="4" fill="#4f46e5" opacity="0.8" />
      <circle cx="160" cy="55" r="4" fill="#818cf8" opacity="0.6" />
    </svg>
  );
}

const mockups = {
  cinepulse: CinePulseScreen,
  pharmacy: PharmacyScreen,
  worktrack: WorkTrackScreen,
} as const;

/* ---------- shared card bits ---------- */
const lift =
  "[transform-style:preserve-3d] transition-all duration-300 ease-[cubic-bezier(.25,.8,.25,1)] hover:-translate-y-2 hover:border-accent hover:shadow-lift";

function StatusBadge({ project }: { project: Project }) {
  const live = project.status === "live";
  return (
    <span
      className={`absolute right-5 top-5 z-[1] rounded-full border px-3 py-1.5 text-[11px] font-[650] uppercase tracking-[0.08em] ${
        live
          ? "border-[#10b981] bg-[#10b981]/12 text-[#059669] dark:text-[#34d399]"
          : "border-line-strong bg-sink text-muted"
      }`}
    >
      {project.statusLabel}
    </span>
  );
}

function BrowserFrame({ project, small }: { project: Project; small?: boolean }) {
  const Screen = mockups[project.mockup];
  return (
    <div className={`flex items-center justify-center ${small ? "px-5 py-6" : "px-[30px] py-10"}`}>
      <div
        className={`w-full overflow-hidden rounded-[10px] bg-elev shadow-[0_8px_32px_-12px_rgba(0,0,0,0.3)] ${
          small ? "" : "max-w-[420px]"
        }`}
      >
        <div className="flex gap-1.5 border-b border-line bg-sink px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <div
          className={`flex aspect-[16/10] items-center justify-center bg-bg ${
            project.mockup === "worktrack" ? "[&>svg]:bg-[#0d1117]" : ""
          }`}
        >
          <Screen />
        </div>
      </div>
    </div>
  );
}

function TechBadge({ label, kind }: { label: string; kind?: Project["tech"][number]["kind"] }) {
  const styles: Record<string, string> = {
    react: "border-[#61dafb]/70 bg-[#61dafb]/10 text-[#0891b2] dark:text-[#22d3ee]",
    node: "border-[#68a063]/70 bg-[#68a063]/10 text-[#4d7c0f] dark:text-[#84cc16]",
    db: "border-accent bg-accent-soft text-accent-ink",
    muted: "border-line-strong bg-sink text-ink-2 opacity-50",
  };
  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-[550] ${
        kind ? styles[kind] : "border-line-strong bg-sink text-ink-2"
      }`}
    >
      {label}
    </span>
  );
}

function ActionRow({ project }: { project: Project }) {
  const primaryCls =
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-[7px] text-[13.5px] font-[550] transition-all duration-200 hover:-translate-y-0.5 border-accent bg-accent text-white hover:bg-accent-ink hover:border-accent-ink";
  const ghostCls =
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-[7px] text-[13.5px] font-[550] transition-all duration-200 hover:-translate-y-0.5 border-line-strong text-ink hover:border-ink";

  const items: ReactElement[] = [];
  const hasPrimaryExternal = project.actions?.some((a) => a.primary) ?? false;

  if (project.caseStudy && !hasPrimaryExternal) {
    items.push(
      <Link key="case-study" href={`/projects/${project.caseStudy}`} className={primaryCls}>
        View case study <span aria-hidden>→</span>
      </Link>,
    );
  }
  project.actions?.forEach((a) => {
    items.push(
      <a
        key={a.label}
        href={a.href}
        target="_blank"
        rel="noopener noreferrer"
        className={a.primary ? primaryCls : ghostCls}
      >
        {a.label} <span aria-hidden>↗</span>
      </a>,
    );
  });
  if (project.caseStudy && hasPrimaryExternal) {
    items.push(
      <Link key="case-study" href={`/projects/${project.caseStudy}`} className={ghostCls}>
        Case study <span aria-hidden>→</span>
      </Link>,
    );
  }

  if (!items.length) return null;
  return <div className="mt-auto flex flex-wrap gap-3 pt-1">{items}</div>;
}

/* ---------- section ---------- */
export default function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="bg-sink py-[92px] max-sm:py-16">
      <div className="shell">
        <SectionHead
          label="Projects"
          meta="2 shipped · 1 in design"
          title="Things I've engineered."
          lede="Production applications with real users, real databases, and real deployment pipelines. Each project demonstrates full-stack thinking — from data modeling to user experience."
        />

        <div className="grid gap-8">
          {/* Featured */}
          <Reveal as="article" className={`overflow-hidden rounded-card border border-line bg-elev shadow-card ${lift} max-lg:grid max-lg:grid-cols-1`}>
            <div className="relative border-line bg-gradient-to-br from-sink to-bg max-lg:border-b lg:border-r">
              <BrowserFrame project={featured} />
              <StatusBadge project={featured} />
            </div>
            <div className="p-10 max-sm:p-6">
              <p className="mb-3 font-ui text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                {String(projects.indexOf(featured) + 1).padStart(2, "0")} / {featured.title}
              </p>
              <div className="mb-[18px]">
                <h3 className="font-display text-4xl font-medium tracking-[-0.02em] text-ink max-sm:text-[28px]">
                  {featured.subtitle}
                </h3>
              </div>
              <p className="mb-6 leading-relaxed text-ink-2">{featured.desc}</p>

              <p className="mb-2.5 font-ui text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                Technology
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {featured.tech.map((t) => (
                  <TechBadge key={t.label} {...t} />
                ))}
              </div>

              {featured.highlights && (
                <div className="mb-7">
                  <p className="mb-2.5 font-ui text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                    What I engineered
                  </p>
                  <div className="grid gap-2.5">
                    {featured.highlights.map((h) => (
                      <p key={h} className="flex items-center gap-2.5 text-[14.5px] text-ink-2">
                        <span aria-hidden className="text-accent">
                          ✓
                        </span>
                        {h}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <ActionRow project={featured} />
            </div>
          </Reveal>

          {/* Secondary grid */}
          <div className="grid gap-6 max-lg:grid-cols-1 lg:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal
                key={p.id}
                as="article"
                delay={i * 0.08}
                className={`flex flex-col overflow-hidden rounded-card border border-line bg-elev shadow-card ${lift}`}
              >
                <div className="relative border-b border-line bg-gradient-to-br from-sink to-bg">
                  <BrowserFrame project={p} small />
                  <StatusBadge project={p} />
                </div>
                <div className="flex flex-1 flex-col p-[30px] max-sm:p-[22px]">
                  <div className="mb-[18px]">
                    <h3 className="mb-1 font-display text-[32px] font-medium tracking-[-0.02em] text-ink max-sm:text-[26px]">
                      {p.title}
                    </h3>
                    <p className="text-base text-muted">{p.subtitle}</p>
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-ink-2">{p.desc}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <TechBadge key={t.label} {...t} />
                    ))}
                  </div>
                  {p.note && (
                    <p className="mb-4 mt-auto text-[13px] italic text-faint">{p.note}</p>
                  )}
                  <ActionRow project={p} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Easter egg hint */}
        <Reveal className="mt-10 rounded-card border border-dashed border-line-strong bg-sink px-6 py-5 text-center">
          <p className="text-sm text-muted">
            <span aria-hidden className="mr-1.5 text-accent">
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
