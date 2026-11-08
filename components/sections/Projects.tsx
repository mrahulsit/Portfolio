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
      <rect fill="#4f46e5" x="28" y="112" width="100" height="10" rx="4" opacity="0.5" />
      <rect fill="#30363d" x="28" y="196" width="60" height="8" rx="4" />
      <rect fill="#30363d" x="96" y="196" width="36" height="8" rx="4" />
      <rect fill="#161b22" x="156" y="104" width="116" height="118" rx="10" />
      <rect fill="#1a1f2e" x="164" y="112" width="100" height="78" rx="6" />
      <rect fill="#818cf8" x="164" y="112" width="100" height="10" rx="4" opacity="0.5" />
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
      <rect fill="#4f46e5" x="92" y="36" width="120" height="32" rx="8" opacity="0.5" />
      <rect fill="#30363d" x="92" y="76" width="80" height="8" rx="4" />
      <rect fill="#161b22" x="72" y="108" width="208" height="48" rx="10" />
      <rect fill="#4f46e5" x="92" y="118" width="110" height="24" rx="6" opacity="0.5" />
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
      <rect fill="#818cf8" x="196" y="80" width="170" height="34" rx="10" />
      <rect fill="#30363d" x="24" y="132" width="220" height="34" rx="10" />
      <rect fill="#818cf8" x="170" y="148" width="196" height="34" rx="10" />
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
      <rect fill="#4f46e5" x="134" y="70" width="150" height="34" rx="10" />
      <rect fill="#ffffff" x="16" y="112" width="140" height="30" rx="10" />
      <rect fill="#e2e8f0" x="24" y="120" width="92" height="14" rx="7" />
      <rect fill="#e1f5fe" x="24" y="156" width="252" height="24" rx="12" />
      <rect fill="#bfdbfe" x="32" y="162" width="120" height="12" rx="6" />
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
const lift =
  "[transform-style:preserve-3d] transition-all duration-300 ease-[cubic-bezier(.25,.8,.25,1)] hover:-translate-y-2 hover:border-accent hover:shadow-lift";

export function StatusBadge({ project }: { project: Project }) {
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

export function BrowserFrame({ project, small }: { project: Project; small?: boolean }) {
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

export function TechBadge({ label, kind }: { label: string; kind?: Project["tech"][number]["kind"] }) {
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

export function ActionRow({ project }: { project: Project }) {
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
          meta="4 shipped · 1 in design"
          title="Things I've engineered."
          lede="Production applications with real deployment pipelines — plus AI interfaces and concepts in design. Each one demonstrates full-stack thinking from data model to user experience."
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
