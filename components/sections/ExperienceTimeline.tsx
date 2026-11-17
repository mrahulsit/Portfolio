import Tag from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { experience, type Job } from "@/lib/data";

const eyebrow = "kicker text-faint";

const jobs = experience.filter((j) => j.chip !== "Course");
const courses = experience.filter((j) => j.chip === "Course");

/** Promotion path within one company: horizontal on desktop, vertical on phones. */
function Progression({ steps }: { steps: NonNullable<Job["progression"]> }) {
  return (
    <div className="my-6 rounded-[16px] border border-line bg-bg px-5 py-4">
      <p className={`${eyebrow} mb-4`}>Promotion path</p>
      <ol className="grid gap-4 sm:grid-cols-3 sm:gap-0">
        {steps.map((step, i) => {
          const latest = i === steps.length - 1;
          return (
            <li key={step.title} className="relative flex gap-3 sm:block sm:pr-5">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[5px] top-[17px] -bottom-[14px] w-px bg-line-strong sm:bottom-auto sm:left-[17px] sm:right-1 sm:top-[5px] sm:h-px sm:w-auto"
                />
              )}
              <span
                aria-hidden
                className={`relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2 sm:mt-0 sm:block ${
                  latest
                    ? "border-teal bg-lime shadow-[0_0_0_4px_rgba(185,241,47,0.35)]"
                    : "border-line-strong bg-elev"
                }`}
              />
              <div className="sm:mt-3">
                <p
                  className={`text-[14px] font-[600] leading-snug ${
                    latest ? "text-ink" : "text-ink-2"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-[12px] text-faint">{step.when}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Bullets({ points, small = false }: { points: string[]; small?: boolean }) {
  return (
    <ul className={`grid max-w-[46em] ${small ? "gap-1.5" : "gap-2"}`}>
      {points.map((p) => (
        <li
          key={p}
          className={`relative pl-[22px] leading-relaxed before:absolute before:left-0 before:font-mono before:text-[12px] before:leading-[1.9] before:text-faint before:content-['→'] ${
            small ? "text-[14px] text-ink-2" : "text-[15px]"
          }`}
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

function Tags({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((t) => (
        <li key={t}>
          <Tag size="sm">{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

/** Work history (full cards) followed by a compact courses & training list. */
export default function ExperienceTimeline() {
  return (
    <div className="min-w-0">
      <ol className="m-0 grid list-none gap-6 p-0">
        {jobs.map((job) => (
          <Reveal
            as="li"
            key={job.role + job.org}
            className="rounded-card border border-line bg-elev p-8 transition-shadow duration-300 hover:shadow-lift max-sm:p-6"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <Tag size="sm" variant="accent">
                {job.chip}
              </Tag>
              {job.when && (
                <span className="kicker text-faint">
                  {job.when}
                </span>
              )}
            </div>

            <h3 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink max-sm:text-[24px]">
              {job.role}
            </h3>
            <p className="mt-1.5 text-[15px] font-[550] text-muted">{job.org}</p>

            {job.progression ? <Progression steps={job.progression} /> : <div className="h-5" />}

            <Bullets points={job.points} />
            <Tags tags={job.tags} className="mt-6" />
          </Reveal>
        ))}
      </ol>

      {courses.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h3 className={eyebrow}>Courses &amp; training</h3>
            <span className="text-[12px] text-faint">{courses.length} completed</span>
          </div>

          <ol className="m-0 grid list-none gap-4 p-0">
            {courses.map((course, i) => (
              <Reveal
                as="li"
                key={course.role + course.org}
                delay={i * 0.06}
                className="grid gap-x-8 gap-y-4 rounded-[18px] border border-dashed border-line-strong p-6 md:grid-cols-[200px_1fr]"
              >
                <div>
                  <p className="font-display text-[18px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {course.role}
                  </p>
                  <p className="text-[14px] font-[550] text-muted">
                    {course.org}
                  </p>
                  {course.when && (
                    <p className="kicker mt-2 text-faint">{course.when}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <Bullets points={course.points} small />
                  <Tags tags={course.tags} className="mt-4" />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
