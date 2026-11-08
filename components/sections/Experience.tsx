import SectionHead from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/lib/data";
import ExperienceTimeline from "./ExperienceTimeline";

export default function Experience() {
  return (
    <section id="experience" className="py-[92px] max-sm:py-16">
      <div className="shell">
        <SectionHead
          label="Experience"
          meta="1.8 years · Java → full stack"
          title="Where I've built things."
          lede="Four roles — from core Java fundamentals to production full-stack engineering at Aptus Data Labs."
        />

        <ExperienceTimeline />

        <Reveal className="mt-[70px] grid grid-cols-1 gap-[30px] border-t border-line pt-10 sm:grid-cols-[200px_1fr]">
          <div>
            <h3 className="font-ui text-xs font-[650] uppercase tracking-[0.14em] text-faint">
              Education
            </h3>
            <p className="mt-1 text-sm text-faint sm:hidden">{education.when}</p>
          </div>
          <div>
            <p className="mb-1 font-display text-[21px] text-ink">{education.degree}</p>
            <p className="text-muted">{education.org}</p>
            <p className="mt-1 text-sm text-faint">CGPA {education.cgpa}</p>
          </div>
          <p className="hidden text-sm text-faint sm:block sm:col-start-1 sm:row-start-2">
            {education.when}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
