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
          title="Tools I ship with."
          lede="Grouped by how I use them — the core stack is production-proven; AI & data is what I'm actively shipping next."
        />

        <div className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.06}
              className="rounded-card border border-line bg-elev p-[26px]"
            >
              <div className="mb-[14px] flex items-baseline gap-2.5">
                <h3 className="font-display text-[18px] font-medium text-ink">
                  {group.title}
                  {group.tag && (
                    <span className="text-[10px] font-[650] uppercase tracking-[0.08em] text-accent">
                      {group.tag}
                    </span>
                  )}
                </h3>
              </div>
              {group.desc && (
                <p className="mb-[18px] text-[14px] leading-relaxed text-muted">
                  {group.desc}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {group.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line-strong px-2.5 py-1 text-[12.5px] font-[550] text-ink-2 bg-bg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
