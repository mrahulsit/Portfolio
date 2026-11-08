import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Github, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, writing } from "@/lib/data";

export default function Writing() {
  return (
    <section id="writing" className="py-[92px] max-sm:py-16">
      <div className="shell">
        <SectionHead
          label="Writing"
          meta="& highlights"
          title="Reading, writing, shipping."
        />

        <div className="grid gap-[30px] lg:grid-cols-[1.5fr_1fr]">
          <Reveal
            className="rounded-card border border-line bg-elev p-[34px] shadow-card transition-all duration-300 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:shadow-lift max-sm:p-6"
          >
            <p className="mb-[18px] text-xs font-[650] uppercase tracking-[0.12em] text-accent">
              {writing.eyebrow}
            </p>
            <h3 className="mb-3.5 font-display text-[27px] font-medium tracking-[-0.01em] text-ink">
              {writing.title}
            </h3>
            <p className="mb-[22px] text-ink-2">{writing.body}</p>
            <a
              href={writing.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition-colors hover:text-accent"
            >
              Read on my blog
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </Reveal>

          <Reveal
            delay={0.08}
            className="rounded-card border border-line bg-elev p-[34px] transition-all duration-300 [transform-style:preserve-3d] hover:-translate-y-1 hover:shadow-lift max-sm:p-6"
          >
            <h3 className="mb-4 font-ui text-xs font-[650] uppercase tracking-[0.12em] text-faint">
              Highlights
            </h3>
            <ul className="grid gap-3.5">
              {writing.highlights.map((h) => (
                <li
                  key={h}
                  className="relative pl-[22px] text-[15.5px] before:absolute before:left-0 before:top-[0.55em] before:h-2 before:w-2 before:rounded-full before:bg-accent before:content-['']"
                >
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-[34px] flex flex-wrap items-center justify-between gap-6 rounded-card border border-line bg-sink px-[30px] py-7 max-sm:px-6">
          <div>
            <h3 className="mb-1 font-display text-[21px] text-ink">More on GitHub</h3>
            <p className="text-muted">
              Side projects, experiments and older work — including chatbot interfaces and earlier
              portfolio builds.
            </p>
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-[18px] py-2.5 text-sm font-[550] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_4px_16px_-8px_rgba(79,70,229,0.3)]"
          >
            <Github size={14} />
            {profile.githubHandle}
            <ArrowUpRight size={13} className="opacity-70" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
