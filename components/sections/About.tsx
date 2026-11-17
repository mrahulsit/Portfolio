import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import AsciiPortrait from "@/components/vengeance/AsciiPortrait";
import { about, education, profile } from "@/lib/data";

// Square crop of /og-image.jpg (1200×1200) framed on the face.
const PORTRAIT_CROP: [number, number, number] = [210, 90, 740];

export default function About() {
  return (
    <section id="about" className="py-24 max-sm:py-16">
      <div className="shell">
        <SectionHead index="01" label="About" meta={profile.location} title={about.title} />

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Story */}
          <Reveal className="rounded-card border border-line bg-elev/90 p-8 backdrop-blur-sm sm:p-10 lg:col-span-7">
            <p className="mb-7 font-display text-[clamp(22px,2.4vw,28px)] font-medium leading-[1.3] tracking-[-0.02em] text-ink">
              {about.lede}
            </p>
            <div className="grid gap-4 text-[16px] leading-relaxed text-ink-2">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          {/* ASCII portrait */}
          <Reveal delay={0.08} className="lg:col-span-5 lg:row-span-2">
            <figure className="band-dark topo-dark relative flex h-full flex-col overflow-hidden rounded-card p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="kicker text-lime">rahul.jpg → ascii</span>
                <span className="kicker text-faint">hover me</span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <AsciiPortrait
                  src="/og-image.jpg"
                  alt={`ASCII-art portrait of ${profile.name}`}
                  crop={PORTRAIT_CROP}
                  columns={80}
                  className="max-w-[440px]"
                />
              </div>
              <figcaption className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
                <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">
                  {profile.name}
                </span>
                <span className="kicker text-right text-faint">{profile.role}</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Note */}
          <Reveal
            delay={0.12}
            className="grid gap-6 rounded-card bg-accent p-8 text-accent-text sm:p-10 lg:col-span-7 lg:grid-cols-[auto_1fr] lg:content-center"
          >
            <span aria-hidden className="font-display text-[64px] font-bold leading-[0.6]">
              &ldquo;
            </span>
            <p className="font-display text-[clamp(18px,1.9vw,22px)] font-medium leading-snug tracking-[-0.01em]">
              {about.note}
            </p>
          </Reveal>

          {/* Focus */}
          <Reveal
            delay={0.14}
            className="grid gap-8 rounded-card border border-line bg-elev/90 p-8 backdrop-blur-sm sm:grid-cols-2 sm:p-10 lg:col-span-7"
          >
            {about.focus.map((group) => (
              <div key={group.label}>
                <p className="kicker mb-3 text-faint">{group.label}</p>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-line-strong px-3.5 py-1.5 text-[14px] text-ink"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          {/* Education */}
          <Reveal
            delay={0.16}
            className="flex flex-col justify-between gap-6 rounded-card border border-line bg-elev/90 p-8 backdrop-blur-sm lg:col-span-5"
          >
            <p className="kicker text-faint">Education</p>
            <div>
              <p className="font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {education.degree}
              </p>
              <p className="mt-1.5 text-[14px] text-muted">{education.org}</p>
              <p className="kicker mt-4 text-faint">
                {education.when} · CGPA {education.cgpa}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
