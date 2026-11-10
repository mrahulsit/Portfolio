import SectionHead from "@/components/ui/SectionHead";
import Tag from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { FaArrowRight as ArrowRight, FaExternalLinkAlt as ArrowUpRight } from "react-icons/fa";
import { writing } from "@/lib/data";

export default function Writing() {
  return (
    <section id="writing" className="py-20 max-sm:py-14">
      <div className="shell">
        <SectionHead
          label="Writing"
          meta="Essays & research"
          title="Reading, writing, shipping."
          lede="Occasional long-form notes on the engineering problems I keep coming back to."
        />

        <div className="grid gap-6">
          {writing.posts.map((post, i) => (
            <Reveal
              key={post.href + post.title}
              delay={i * 0.06}
              className="rounded-card border border-line bg-elev p-8 transition-colors duration-300 hover:border-line-strong sm:p-10 lg:p-12"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:gap-14">
                <div>
                  <p className="mb-4 font-ui text-[11px] font-[650] uppercase tracking-[0.14em] text-accent-strong">
                    {writing.eyebrow}
                  </p>
                  <h3 className="mb-4 max-w-[22em] font-display text-[clamp(26px,3.4vw,36px)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">
                    {post.title}
                  </h3>
                  <p className="mb-7 max-w-[58ch] leading-relaxed text-ink-2">{post.body}</p>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-ui text-[14px] font-[650] text-ink transition-colors hover:text-accent-strong"
                  >
                    Read the essay
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </a>
                </div>

                <aside className="flex flex-col gap-6 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <div>
                    <p className="mb-1.5 font-ui text-[10.5px] font-[650] uppercase tracking-[0.14em] text-faint">
                      Published
                    </p>
                    <p className="text-[14px] font-[550] text-ink">Hashnode</p>
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-accent-strong"
                    >
                      effortlesswithrahul
                      <ArrowUpRight size={10} className="opacity-70" />
                    </a>
                  </div>
                  <div>
                    <p className="mb-2.5 font-ui text-[10.5px] font-[650] uppercase tracking-[0.14em] text-faint">
                      Topics
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.topics.map((t) => (
                        <Tag key={t} size="sm">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
