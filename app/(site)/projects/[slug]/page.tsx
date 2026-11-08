import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";

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
    title: `${cs.title} — Case Study | Rahul Mishra`,
    description: `${cs.subtitle}. ${cs.overview.slice(0, 140)}…`,
    alternates: { canonical: `/projects/${cs.slug}` },
    openGraph: {
      title: `${cs.title} — Case Study`,
      description: cs.subtitle,
      url: `/projects/${cs.slug}`,
    },
  };
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <div className="mb-5 flex items-baseline gap-4">
        <b className="font-ui text-xs font-semibold tracking-[0.08em] text-faint">{n}</b>
        <h2 className="font-display text-[26px] font-medium tracking-tight text-ink max-sm:text-[22px]">
          {title}
        </h2>
      </div>
      <div className="max-w-[48em] space-y-4 text-[16.5px] leading-relaxed text-ink-2">
        {children}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <div className="pb-24 pt-10">
      <div className="shell max-w-[880px]">
        <Link
          href="/#projects"
          className="mb-9 inline-flex items-center gap-2 text-sm font-[650] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.14em] text-faint">
              {cs.index} / {cs.title}
            </span>
            <span className="rounded-full border border-[#10b981] bg-[#10b981]/10 px-3 py-1 text-[11px] font-[650] uppercase tracking-[0.08em] text-[#059669] dark:text-[#34d399]">
              {cs.status}
            </span>
          </div>

          <h1 className="mb-3 font-display text-[clamp(38px,6vw,56px)] font-medium leading-[1.04] tracking-[-0.025em] text-ink">
            {cs.subtitle}
          </h1>

          <div className="mb-6 flex flex-wrap gap-2">
            {cs.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line-strong bg-sink px-3 py-1.5 text-xs font-[550] text-ink-2"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="max-w-[46em] text-[17.5px] leading-relaxed text-muted">{cs.overview}</p>
        </header>

        <div className="space-y-12">
          <Section n="01" title="Problem statement">
            <p>{cs.problem}</p>
          </Section>

          <Section n="02" title="My role">
            <p>{cs.role}</p>
          </Section>

          <Section n="03" title="System architecture">
            <div className="space-y-0 py-1">
              {cs.architecture.map((a, i) => (
                <div key={a.layer}>
                  {i > 0 && (
                    <div className="flex items-center gap-3 py-2 pl-6">
                      <span aria-hidden className="text-accent">
                        ↓
                      </span>
                      <span className="font-ui text-[11.5px] font-[650] uppercase tracking-[0.1em] text-faint">
                        {a.protocol ?? "data flow"}
                      </span>
                    </div>
                  )}
                  <div className="rounded-card border border-line bg-elev px-6 py-5 shadow-card">
                    <p className="font-display text-lg font-medium text-ink">{a.layer}</p>
                    <p className="mt-1 text-sm text-muted">{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[13px] italic text-faint">
              Illustrative architecture of the deployed system.
            </p>
          </Section>

          <Section n="04" title="Technology decisions">
            <dl className="space-y-5">
              {cs.decisions.map((d) => (
                <div key={d.title}>
                  <dt className="mb-1 font-ui text-[15.5px] font-semibold text-ink">{d.title}</dt>
                  <dd className="text-ink-2">{d.body}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n="05" title="Challenges & solutions">
            <dl className="space-y-5">
              {cs.challenges.map((c) => (
                <div key={c.title}>
                  <dt className="mb-1 font-ui text-[15.5px] font-semibold text-ink">{c.title}</dt>
                  <dd className="text-ink-2">{c.body}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n="06" title="What I'd improve next">
            <ul className="space-y-2.5">
              {cs.next.map((n) => (
                <li key={n} className="relative pl-[22px] before:absolute before:left-0 before:text-accent before:content-['—']">
                  {n}
                </li>
              ))}
            </ul>
          </Section>

          <Section n="07" title="Links">
            {cs.links.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {cs.links.map((l, i) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-[550] transition-all duration-200 hover:-translate-y-0.5 ${
                      i === 0
                        ? "border-accent bg-accent text-white hover:bg-accent-ink hover:border-accent-ink"
                        : "border-line-strong text-ink hover:border-ink"
                    }`}
                  >
                    {l.label} <ArrowUpRight size={13} />
                  </a>
                ))}
                {cs.links.some((l) => l.href.includes("github")) && (
                  <span className="inline-flex items-center gap-2 text-sm text-faint">
                    <Github size={13} /> repository linked above
                  </span>
                )}
              </div>
            ) : (
              <p className="text-muted">{cs.linksNote}</p>
            )}
          </Section>
        </div>

        <nav className="mt-14 flex items-center justify-between border-t border-line pt-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-[650] text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={14} /> Back to projects
          </Link>
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-[550] text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
          >
            Download Resume
          </Link>
        </nav>
      </div>
    </div>
  );
}
