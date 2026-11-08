import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { about, profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="bg-sink py-[92px] max-sm:py-16">
      <div className="shell">
        <SectionHead label="About" meta={`${profile.location}`} title={about.title} />

        <div className="grid gap-[60px] lg:grid-cols-[2fr_1fr]">
          <Reveal className="max-w-none">
            <p className="mb-[1.1em] font-display text-[21px] font-medium leading-snug text-ink">
              {about.lede}
            </p>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mb-[1.15em]">
                {p}
              </p>
            ))}
            <p className="border-l-2 border-line-strong pl-[18px] text-[15px] text-muted">
              {about.note}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="self-start">
            <aside
              aria-labelledby="focus-h"
              className="rounded-card border border-line bg-elev px-[26px] pb-5 pt-[26px]"
            >
              <h3
                id="focus-h"
                className="mb-[18px] flex items-center gap-2.5 font-display text-[15px] font-medium text-ink after:h-px after:flex-1 after:bg-line after:content-['']"
              >
                Currently focused on
              </h3>
              <ul className="grid gap-0.5">
                {about.focus.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 border-b border-dashed border-line py-[9px] text-[15px] last:border-b-0 before:font-semibold before:text-accent before:content-['—']"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
