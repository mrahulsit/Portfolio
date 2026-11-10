import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { about, profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="bg-sink py-20 max-sm:py-14">
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
            <p className="border-l-2 border-accent pl-[18px] text-[15px] leading-relaxed text-ink-2">
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
                className="mb-4 flex items-center gap-2.5 font-display text-[15px] font-medium text-ink after:h-px after:flex-1 after:bg-line after:content-['']"
              >
                Currently focused on
              </h3>
              <div className="grid gap-5">
                {about.focus.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 font-ui text-[10.5px] font-[650] uppercase tracking-[0.14em] text-faint">
                      {group.label}
                    </p>
                    <ul className="grid gap-1.5">
                      {group.items.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 text-[15px] before:font-semibold before:text-accent-strong before:content-['—']"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
