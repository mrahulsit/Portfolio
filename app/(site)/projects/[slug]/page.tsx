import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft as ArrowLeft,
  FaArrowRight as ArrowRight,
  FaCheck as Check,
  FaChevronDown as ChevronDown,
  FaExternalLinkAlt as ExternalLink,
  FaGithub as Github,
} from "react-icons/fa";
import { caseStudies, getCaseStudy, type CaseStudy } from "@/lib/caseStudies";
import { projects } from "@/lib/data";
import Tag from "@/components/ui/Tag";
import { ProjectScreen } from "@/components/sections/Projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — ${cs.subtitle} | Rahul Mishra`,
    description: `${cs.subtitle}. ${cs.overview.slice(0, 140)}…`,
    alternates: { canonical: `/projects/${cs.slug}` },
    openGraph: {
      title: `${cs.title} — ${cs.subtitle}`,
      description: cs.overview.slice(0, 200),
      url: `/projects/${cs.slug}`,
    },
  };
}

const eyebrow = "font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint";

/** Layers grouped by tier, top (client) to bottom (data / external services). */
function Architecture({ layers }: { layers: CaseStudy["architecture"] }) {
  const tiers: CaseStudy["architecture"][] = [];
  const byTier = new Map<number, CaseStudy["architecture"]>();
  layers.forEach((layer, i) => {
    const key = layer.tier ?? i;
    if (!byTier.has(key)) {
      const group: CaseStudy["architecture"] = [];
      byTier.set(key, group);
      tiers.push(group);
    }
    byTier.get(key)!.push(layer);
  });

  return (
    <ol className="m-0 list-none p-0" aria-label="System architecture, from client to data">
      {tiers.map((tier, i) => (
        <li key={tier.map((l) => l.layer).join("|")}>
          {i > 0 && (
            <div aria-hidden className="relative h-9">
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong" />
              <ChevronDown
                size={11}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-accent-strong"
              />
            </div>
          )}
          <div className={`grid gap-3 ${tier.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {tier.map((l) => (
              <div
                key={l.layer}
                className="rounded-[14px] border border-line bg-elev px-5 py-4 shadow-card"
              >
                {l.protocol && (
                  <p className="mb-2 text-[12px] font-[550] text-accent-strong">via {l.protocol}</p>
                )}
                <p className="font-display text-[18px] font-medium leading-snug text-ink">
                  {l.layer}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{l.detail}</p>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-ui text-xs font-semibold tabular-nums tracking-[0.08em] text-faint">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="font-display text-[28px] font-medium tracking-tight text-ink max-sm:text-[23px]">
          {title}
        </h2>
      </div>
      <div className="text-[16.5px] leading-relaxed text-ink-2">{children}</div>
    </section>
  );
}

function TitledList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((d) => (
        <div key={d.title} className="rounded-[14px] border border-line bg-elev/60 p-5">
          <dt className="mb-1.5 font-ui text-[15.5px] font-semibold leading-snug text-ink">
            {d.title}
          </dt>
          <dd className="text-[14.5px] leading-relaxed text-ink-2">{d.body}</dd>
        </div>
      ))}
    </dl>
  );
}

function LinkButtons({ cs }: { cs: CaseStudy }) {
  if (!cs.links.length) {
    return cs.linksNote ? <p className="text-[14px] text-faint">{cs.linksNote}</p> : null;
  }
  return (
    <div className="flex flex-wrap gap-3">
      {cs.links.map((l, i) => {
        const isCode = l.href.includes("github.com");
        return (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-[650] transition-all duration-200 hover:-translate-y-0.5 ${
              i === 0
                ? "border-accent bg-accent text-accent-text hover:border-accent-ink hover:bg-accent-ink"
                : "border-line-strong text-ink hover:border-ink"
            }`}
          >
            {isCode ? <Github size={14} aria-hidden /> : <ExternalLink size={12} aria-hidden />}
            {l.label}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        );
      })}
    </div>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const design = cs.stage === "design";
  const project = projects.find((p) => p.caseStudy === cs.slug);
  const position = caseStudies.findIndex((c) => c.slug === cs.slug);
  const prev = caseStudies[position - 1];
  const next = caseStudies[position + 1];

  let n = 0;
  const num = () => ++n;

  return (
    <div className="pb-24 pt-10">
      <div className="shell max-w-[960px]">
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-sm font-[650] text-muted transition-colors hover:text-accent-strong"
        >
          <ArrowLeft size={13} aria-hidden /> All projects
        </Link>

        {/* Intro */}
        <div className="mb-12">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className={`${eyebrow} tabular-nums`}>
              {cs.index} / {String(caseStudies.length).padStart(2, "0")}
            </span>
            <Tag size="sm" variant={design ? "muted" : "accent"}>
              {cs.status}
            </Tag>
          </div>

          <h1 className="font-display text-[clamp(44px,7vw,72px)] font-medium leading-[1] tracking-[-0.03em] text-ink">
            {cs.title}
          </h1>
          <p className="mt-3 text-[clamp(18px,2.2vw,22px)] font-[550] text-accent-strong">
            {cs.subtitle}
          </p>
          <p className="mt-6 max-w-[46em] text-[17.5px] leading-relaxed text-ink-2">
            {cs.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {cs.tech.map((t) => (
              <Tag key={t} size="sm" variant={design ? "muted" : "neutral"}>
                {t}
              </Tag>
            ))}
          </div>

          <div className="mt-8">
            <LinkButtons cs={cs} />
          </div>
        </div>

        {project && (
          <div className="mb-14 overflow-hidden rounded-[22px] border border-line bg-elev shadow-card">
            <ProjectScreen project={project} />
          </div>
        )}

        <div className="space-y-14">
          <Section n={num()} title={design ? "Why build it" : "The problem"}>
            <p className="max-w-[48em]">{cs.problem}</p>
          </Section>

          <Section n={num()} title="My role">
            <p className="max-w-[48em]">{cs.role}</p>
          </Section>

          {cs.features && cs.features.length > 0 && (
            <Section n={num()} title={design ? "What it will do" : "What it does"}>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {cs.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15.5px]">
                    <span
                      aria-hidden
                      className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong"
                    >
                      <Check size={9} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section n={num()} title={design ? "Planned architecture" : "Architecture"}>
            <Architecture layers={cs.architecture} />
            {design && (
              <p className="mt-4 text-[13px] italic text-faint">
                Proposed architecture — not built yet.
              </p>
            )}
          </Section>

          <Section n={num()} title={design ? "Planned approach" : "Technology decisions"}>
            <TitledList items={cs.decisions} />
          </Section>

          <Section n={num()} title={design ? "Open questions" : "Challenges & solutions"}>
            <TitledList items={cs.challenges} />
          </Section>

          <Section n={num()} title={design ? "Build plan" : "What I'd improve next"}>
            {design ? (
              <ol className="grid gap-3">
                {cs.next.map((step, i) => (
                  <li key={step} className="flex items-center gap-4 text-[15.5px]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong font-ui text-[12px] font-[650] tabular-nums text-ink-2">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="grid gap-2.5">
                {cs.next.map((item) => (
                  <li
                    key={item}
                    className="relative pl-[22px] before:absolute before:left-0 before:text-accent-strong before:content-['—']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* Previous / next project */}
        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group rounded-[14px] border border-line bg-elev p-5 transition-colors duration-200 hover:border-accent"
            >
              <span className={`${eyebrow} inline-flex items-center gap-2`}>
                <ArrowLeft size={10} aria-hidden /> Previous
              </span>
              <span className="mt-2 block font-display text-[21px] text-ink transition-colors group-hover:text-accent-strong">
                {prev.title}
              </span>
              <span className="block text-[13.5px] text-muted">{prev.subtitle}</span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-[14px] border border-line bg-elev p-5 text-right transition-colors duration-200 hover:border-accent"
            >
              <span className={`${eyebrow} inline-flex items-center gap-2`}>
                Next <ArrowRight size={10} aria-hidden />
              </span>
              <span className="mt-2 block font-display text-[21px] text-ink transition-colors group-hover:text-accent-strong">
                {next.title}
              </span>
              <span className="block text-[13.5px] text-muted">{next.subtitle}</span>
            </Link>
          ) : (
            <Link
              href="/projects"
              className="group flex flex-col justify-center rounded-[14px] border border-line bg-elev p-5 text-right transition-colors duration-200 hover:border-accent"
            >
              <span className={`${eyebrow} inline-flex items-center justify-end gap-2`}>
                All projects <ArrowRight size={10} aria-hidden />
              </span>
              <span className="mt-2 block font-display text-[21px] text-ink transition-colors group-hover:text-accent-strong">
                Back to the full list
              </span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
