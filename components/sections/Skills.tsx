import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="Skills"
          meta="The toolkit"
          title="Tools I ship with."
          lede="Grouped by how I use them — the core stack is production-proven; AI & data is what I'm actively shipping next."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.06}
              className={`h-full rounded-card border border-line bg-elev p-[26px] ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex h-full flex-col">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[18px] font-medium text-ink">
                    {group.title}
                  </h3>
                  {group.tag && (
                    <span className="rounded-full border border-accent bg-accent-soft px-2 py-0.5 text-[10px] font-[650] uppercase tracking-[0.08em] text-accent-strong">
                      Exploring
                    </span>
                  )}
                </div>
                {group.desc && (
                  <p className="mb-[18px] max-w-[42em] text-[14px] leading-relaxed text-muted">
                    {group.desc}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((t) => (
                    <Tag key={t} size="md">
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
