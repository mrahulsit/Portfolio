import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { education, experience, profile } from "@/lib/data";
import ExperienceTimeline from "./ExperienceTimeline";

const eyebrow =
  "font-ui text-[10.5px] font-[650] uppercase tracking-[0.16em] text-faint";

function AtAGlance() {
  const latest = experience[0];
  const titlesHeld = latest.progression?.length ?? 1;

  return (
    <aside
      aria-label="Experience at a glance"
      className="overflow-hidden rounded-card border border-line bg-elev shadow-card"
    >
      {/* Header: title + availability */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
        <p className={eyebrow}>At a glance</p>
        {profile.availability.open && (
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-[11px] font-[650] text-accent-strong">
            <span aria-hidden className="avail-dot" />
            Available
          </span>
        )}
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
        <div className="px-6 py-5">
          <p className="font-display text-[34px] leading-none tracking-[-0.02em] text-ink">
            {profile.experienceYears}
            <span className="ml-1 font-ui text-[13px] font-[550] tracking-normal text-muted">yrs</span>
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted">Experience</p>
        </div>
        <div className="px-6 py-5">
          <p className="font-display text-[34px] leading-none tracking-[-0.02em] text-ink">
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
          <dd className="font-display text-[14px] italic text-accent-strong">{latest.org}</dd>
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

      {/* Education */}
      <div className="border-t border-line bg-sink/50 px-6 py-5">
        <p className={eyebrow}>Education</p>
        <p className="mt-2 font-display text-[15.5px] leading-snug text-ink">{education.degree}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{education.org}</p>
        <p className="mt-2 flex flex-wrap gap-x-2 text-[12px] text-faint">
          <span>{education.when}</span>
          <span aria-hidden>·</span>
          <span>CGPA {education.cgpa}</span>
        </p>
      </div>

      {/* Action */}
      <Link
        href="/resume"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-t border-line px-6 py-4 text-[13.5px] font-[650] text-ink transition-colors duration-200 hover:bg-accent hover:text-accent-text focus-visible:bg-accent focus-visible:text-accent-text focus-visible:outline-none"
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
    <section id="experience" className="py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="Experience"
          meta={`${profile.experienceYears} years · Java → full stack`}
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
