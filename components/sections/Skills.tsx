import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import HighlightGrid from "@/components/vengeance/HighlightGrid";
import { skills } from "@/lib/data";

const [core, ...groups] = skills;

// The interactive grid shows the everyday stack: the core group, topped up to
// a full 12-cell grid with the most-used backend and testing tools.
const gridItems = [
  ...core.tags.map((label) => ({ label, note: "Core" })),
  ...[
    { label: "Express.js", note: "Backend" },
    { label: "Jest", note: "Testing" },
    { label: "Playwright", note: "Testing" },
  ],
].slice(0, 12);

export default function Skills() {
  return (
    <section id="skills" className="py-24 max-sm:py-16">
      <div className="shell">
        <SectionHead
          index="04"
          label="Skills"
          meta="The toolkit"
          title="Tools I ship with."
          lede="The core stack is production-proven — hover the grid. AI & data is what I'm actively shipping next."
        />

        <Reveal>
          <HighlightGrid items={gridItems} className="mb-5 overflow-hidden rounded-card bg-elev" />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.06}
              className={`flex h-full flex-col rounded-card p-7 ${
                group.tag ? "band-dark" : "border border-line bg-elev"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
                  {group.title}
                </h3>
                {group.tag && (
                  <span className="kicker rounded-full bg-lime px-2 py-0.5 text-[10px] text-teal">
                    Exploring
                  </span>
                )}
              </div>
              {group.desc && (
                <p className="mb-6 text-[14px] leading-relaxed text-muted">{group.desc}</p>
              )}
              <div className="mt-auto flex flex-wrap gap-1.5">
                {group.tags.map((t) => (
                  <Tag key={t} size="sm">
                    {t}
                  </Tag>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
