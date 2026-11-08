import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-[92px] max-sm:py-16">
      <div className="shell">
        <SectionHead
          label="Skills"
          meta="The toolkit"
          title="Tools I reach for."
          lede="The technologies I use day to day, and the ones I'm actively exploring."
        />

        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.05}
              className={`rounded-card border border-line bg-elev p-[26px] transition-all duration-300 ease-[cubic-bezier(.25,.8,.25,1)] [transform-style:preserve-3d] hover:-translate-y-1.5 hover:border-accent hover:shadow-lift ${
                group.muted ? "max-lg:grid max-lg:grid-cols-1" : ""
              }`}
            >
              <h3 className="mb-[18px] flex items-baseline gap-2.5 font-display text-[19px] text-ink">
                {group.title}
                {"tag" in group && group.tag && (
                  <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.06em] text-accent">
                    {group.tag}
                  </span>
                )}
              </h3>
              <ul className={`flex flex-wrap gap-2 ${group.muted ? "text-muted" : ""}`}>
                {group.tags.map((t) => (
                  <li
                    key={t}
                    className={`rounded-full border px-[15px] py-2 text-[13.5px] font-[550] ${
                      group.muted
                        ? "border-line-strong bg-elev text-muted"
                        : "border-line-strong bg-elev text-ink-2"
                    }`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
