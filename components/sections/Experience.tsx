import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { experience, profile } from "@/lib/data";
import ExperienceTimeline from "./ExperienceTimeline";

const eyebrow = "kicker text-faint";

function AtAGlance() {
  const latest = experience[0];
  const titlesHeld = latest.progression?.length ?? 1;

  return (
    <aside
      aria-label="Experience at a glance"
      className="band-dark overflow-hidden rounded-card"
    >
      {/* Header: title + availability */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
        <p className={eyebrow}>At a glance</p>
        {profile.availability.open && (
          <span className="inline-flex items-center gap-2 rounded-full bg-lime px-2.5 py-1 text-[11px] font-[650] text-teal">
            <span aria-hidden className="avail-dot" />
            Available
          </span>
        )}
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
        <div className="px-6 py-5">
          <p className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-ink">
            {profile.experienceYears}
            <span className="ml-1 font-ui text-[13px] font-[550] tracking-normal text-muted">yrs</span>
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted">Experience</p>
        </div>
        <div className="px-6 py-5">
          <p className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-ink">
            {titlesHeld}
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted">Roles at {latest.org.split(" ")[0]}</p>
        </div>
      </div>

      {/* Details: label above value so long values never squeeze */}
      <dl className="grid gap-4 px-6 py-5">
        <div>
          <dt className={eyebrow}>Latest role</dt>
          <dd className="mt-1.5 text-[14.5px] font-[600] leading-snug text-ink">{latest.role}</dd>
          <dd className="text-[14px] font-[550] text-accent-strong">{latest.org}</dd>
        </div>
        <div>
          <dt className={eyebrow}>Based in</dt>
          <dd className="mt-1.5 text-[14px] font-[550] text-ink">{profile.location}</dd>
        </div>
        <div>
          <dt className={eyebrow}>Open to</dt>
          <dd className="mt-1.5 text-[14px] font-[550] text-ink">{profile.workModes}</dd>
        </div>
      </dl>

      {/* Action */}
      <Link
        href="/resume"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-t border-line px-6 py-4 text-[13.5px] font-[650] text-ink transition-colors duration-200 hover:bg-lime hover:text-teal focus-visible:bg-lime focus-visible:text-teal focus-visible:outline-none"
      >
        View full résumé
        <FaArrowRight
          size={12}
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </aside>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 max-sm:py-16">
      <div className="shell">
        <SectionHead
          index="02"
          label="Experience"
          meta={
            <span className="inline-flex items-center gap-1.5">
              {profile.experienceYears} years · Java
              <FiArrowRight aria-hidden size={12} />
              <span className="sr-only">to</span>
              full stack
            </span>
          }
          title="Where I've built things."
          lede="Production full-stack engineering at Aptus Data Labs — built on earlier courses in web development and core Java."
        />

        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-14">
          <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <AtAGlance />
          </Reveal>

          <ExperienceTimeline />
        </div>
      </div>
    </section>
  );
}
