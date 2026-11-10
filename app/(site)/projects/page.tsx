import type { Metadata } from "next";
import Link from "next/link";
import { FaChevronLeft as ChevronLeft } from "react-icons/fa";
import { MdLayers as Layers } from "react-icons/md";
import SectionHead from "@/components/ui/SectionHead";
import Tag from "@/components/ui/Tag";
import {
  ActionRow,
  ProjectScreen,
  StatusBadge,
  TechList,
} from "@/components/sections/Projects";
import { projects } from "@/lib/data";

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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const active: Filter = raw === "live" || raw === "design" ? raw : "all";
  const listed =
    active === "all"
      ? projects
      : projects.filter((p) => p.status === active);
  const featured = projects[0];

  return (
    <div className="py-[92px] max-sm:pt-16 pb-[60px]">
      <div className="shell">
        <nav className="mb-[60px] flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <Link href="/" className="text-ink-2 hover:text-accent-strong transition-colors">
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

        <div className="mb-[44px] flex flex-wrap items-center gap-5 border-b border-line pb-4">
          <Layers size={13} className="text-faint" aria-hidden />
          <div className="flex flex-wrap gap-5">
            {(["all", "live", "design"] as Filter[]).map((f) => {
              const isActive = active === f;
              return (
                <Link
                  key={f}
                  href={`/projects?status=${f}`}
                  className={`border-b pb-1 font-ui text-[11px] font-[650] uppercase tracking-[0.14em] transition-colors duration-200 ${
                    isActive
                      ? "border-accent text-ink"
                      : "border-transparent text-muted hover:text-ink"
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
          <article className="group grid overflow-hidden rounded-[22px] border border-line bg-elev transition-colors duration-300 hover:border-line-strong lg:grid-cols-[1.02fr_1fr]">
            <ProjectScreen
              project={featured}
              className="border-b border-line lg:border-b-0 lg:border-r"
            />
            <div className="flex flex-col p-7 sm:p-10 lg:p-11">
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint">
                  01 — {featured.title}
                </span>
                <StatusBadge project={featured} />
              </div>

              <h1 className="mb-4 max-w-[16em] font-display text-[clamp(34px,4vw,52px)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
                {featured.subtitle}
              </h1>
              <p className="mb-7 max-w-[46ch] leading-relaxed text-ink-2">{featured.desc}</p>

              <TechList tech={featured.tech} className="mb-7" />

              {featured.highlights && (
                <div className="mb-8 border-t border-line pt-6">
                  <p className="mb-3 font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint">
                    Engineering
                  </p>
                  <ul className="grid gap-x-7 gap-y-2 sm:grid-cols-2">
                    {featured.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ActionRow project={featured} className="mt-auto" />
            </div>
          </article>
        )}

        {/* Grid */}
        <div
          className={`mt-[60px] grid gap-6 lg:grid-cols-2 ${
            listed.length === 0 ? "min-h-[300px] items-center justify-center" : ""
          }`}
        >
          {listed.map((p) => {
            if (active === "all" && p.id === featured.id) return null;
            return (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-elev transition-colors duration-300 hover:border-line-strong"
              >
                <ProjectScreen project={p} compact className="border-b border-line" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint">
                      {String(projects.indexOf(p) + 1).padStart(2, "0")} — {p.title}
                    </span>
                    <StatusBadge project={p} />
                  </div>

                  <h3 className="mb-1.5 font-display text-[27px] font-medium leading-tight tracking-[-0.02em] text-ink">
                    {p.subtitle}
                  </h3>
                  <p className="mb-5 line-clamp-3 text-[14px] leading-relaxed text-ink-2">
                    {p.desc}
                  </p>

                  <TechList tech={p.tech} className="mb-5" />

                  {p.note && (
                    <p className="mb-5 mt-auto font-ui text-[10.5px] font-[600] uppercase tracking-[0.14em] text-faint">
                      {p.note}
                    </p>
                  )}

                  <ActionRow project={p} className={p.note ? "" : "mt-auto"} />
                </div>
              </article>
            );
          })}
        </div>

        <nav className="mt-[60px] flex items-center justify-between border-t border-line pt-[32px] text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent-strong hover:pl-4"
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
