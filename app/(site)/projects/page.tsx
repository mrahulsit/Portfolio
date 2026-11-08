import type { Metadata } from "next";
import Link from "next/link";
import { FaChevronLeft as ChevronLeft, FaFilter as Filter } from "react-icons/fa";
import { MdLayers as Layers } from "react-icons/md";
import SectionHead from "@/components/ui/SectionHead";
import {
  ActionRow,
  BrowserFrame,
  StatusBadge,
  TechBadge,
} from "@/components/sections/Projects";
import { projects, type Project } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects · Rahul Mishra",
  description:
    "Production applications and AI interfaces engineered by Rahul Mishra — full-stack thinking from data model to user experience.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · Rahul Mishra",
    description:
      "Production applications and AI interfaces engineered by Rahul Mishra — full-stack thinking from data model to user experience.",
    type: "website",
    url: "/projects",
  },
};

type Filter = "all" | "live" | "design";

const filterLabels: Record<Filter, string> = {
  all: "All projects",
  live: "Shipped",
  design: "In design",
};

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const active = (searchParams.status as Filter) ?? "all";
  const listed =
    active === "all"
      ? projects
      : projects.filter((p) => p.status === active);
  const featured = projects[0];
  const rest = listed.filter((p) => p.id !== featured.id);

  return (
    <div className="py-[92px] max-sm:pt-16 pb-[60px]">
      <div className="shell">
        <nav className="mb-[60px] flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <Link href="/" className="text-ink-2 hover:text-accent transition-colors">
            Home
          </Link>
          <span aria-hidden className="text-faint">/</span>
          <span className="text-ink">Projects</span>
        </nav>

        <SectionHead
          label="Projects"
          meta={`${listed.length} listed · ${projects.filter((p) => p.status === "live").length} shipped · ${projects.filter((p) => p.status === "design").length} in design`}
          title="Things I've engineered."
          lede="Production applications with real deployment pipelines — plus AI interfaces and concepts in design. Each one demonstrates full-stack thinking from data model to user experience."
        />

        <div className="mb-[44px] flex flex-wrap items-center gap-3">
          <Layers size={14} className="text-faint" aria-hidden />
          <div className="flex gap-2">
            {(["all", "live", "design"] as Filter[]).map((f) => {
              const isActive = active === f;
              return (
                <Link
                  key={f}
                  href={`/projects?status=${f}`}
                  className={`rounded-full border px-4 py-1.5 text-[12.5px] font-[550] uppercase tracking-[0.06em] transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-line-strong text-ink-2 hover:border-accent"
                  }`}
                >
                  {filterLabels[f]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured */}
        {active === "all" && featured && (
          <article
            className="overflow-hidden rounded-card border border-line bg-elev shadow-card [transform-style:preserve-3d] transition-all duration-300 ease-[cubic-bezier(.25,.8,.25,1)] hover:-translate-y-2 hover:border-accent hover:shadow-lift"
          >
            <div className="relative border-line bg-gradient-to-br from-sink to-bg">
              <BrowserFrame project={featured} />
              <StatusBadge project={featured} />
            </div>
            <div className="p-[40px] max-w-none lg:grid lg:grid-cols-12 lg:gap-[60px]">
              <div className="lg:col-span-7">
                <p className="mb-3 font-ui text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                  01 / {featured.title}
                </p>
                <div className="mb-[24px]">
                  <h1 className="font-display text-[clamp(40px,6vw,64px)] font-medium tracking-[-0.02em] text-ink leading-[1.05]">
                    {featured.subtitle}
                  </h1>
                </div>
                <p className="mb-8 leading-relaxed text-ink-2 text-lg max-w-[44em]">
                  {featured.desc}
                </p>

                <p className="mb-[24px] font-ui text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                  Technology
                </p>
                <div className="mb-[24px] flex flex-wrap gap-2">
                  {featured.tech.map((t) => (
                    <TechBadge key={t.label} {...t} />
                  ))}
                </div>

                {featured.highlights && (
                  <div className="mb-[24px]">
                    <p className="mb-2 font-ui text-[11px] font-[650] uppercase tracking-[0.12em] text-faint">
                      What I engineered
                    </p>
                    <div className="grid gap-2.5">
                      {featured.highlights.map((h) => (
                        <p
                          key={h}
                          className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-2"
                        >
                          <span aria-hidden className="flex shrink-0 mt-[0.1em] text-accent">
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
              <div className="lg:col-span-5 flex items-end justify-end">
                <a
                  href={`/projects/${featured.caseStudy ?? featured.id}`}
                  className="inline-block rounded-full border border-line-strong px-[22px] py-[16px] text-[15px] font-[650] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink"
                >
                  <span className="mr-2">Read case study</span>
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </article>
        )}

        {/* Grid */}
        <div className={`mt-[60px] grid gap-[40px] lg:grid-cols-2 ${listed.length === 0 ? "min-h-[300px] items-center justify-center" : ""}`}>
          {listed.map((p) => {
            if (p.id === featured.id) return null;
            return (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-card border border-line bg-elev shadow-card [transform-style:preserve-3d] transition-all duration-300 ease-[cubic-bezier(.25,.8,.25,1)] hover:-translate-y-2 hover:border-accent hover:shadow-lift"
              >
                <div className="relative border-b border-line bg-gradient-to-br from-sink to-bg aspect-[4/3] md:aspect-auto md:h-[300px]">
                  <BrowserFrame project={p} small />
                  <StatusBadge project={p} />
                </div>
                <div className="flex-1 flex-col p-[32px]">
                  <div className="mb-[16px]">
                    <h3 className="mb-1 font-display text-[30px] font-medium tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="text-base text-muted">{p.subtitle}</p>
                  </div>
                  <p className="mb-[24px] leading-relaxed text-ink-2 text-sm">{p.desc}</p>
                  <div className="mb-[24px] flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <TechBadge key={t.label} {...t} />
                    ))}
                  </div>
                  {p.note && (
                    <p className="mb-auto mt-[24px] text-[13px] italic text-faint">
                      {p.note}
                    </p>
                  )}
                  <ActionRow project={p} />
                </div>
              </article>
            );
          })}
        </div>

        <nav className="mt-[60px] flex items-center justify-between border-t border-line pt-[32px] text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent hover:pl-4"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to homepage
          </Link>
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[16px] py-2 text-[13px] font-[650] text-ink transition-all hover:border-ink"
          >
            Download Resume <Layers size={12} />
          </Link>
        </nav>
      </div>
    </div>
  );
}
