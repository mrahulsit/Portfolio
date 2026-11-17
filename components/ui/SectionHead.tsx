import StaggerText from "@/components/vengeance/StaggerText";

type SectionHeadProps = {
  /** Two-digit section number, e.g. "01". */
  index?: string;
  label: string;
  meta: React.ReactNode;
  title: string;
  lede?: React.ReactNode;
};

export default function SectionHead({ index, label, meta, title, lede }: SectionHeadProps) {
  return (
    <div className="mb-14 max-sm:mb-10">
      <div className="mb-8 flex items-center gap-4 border-b border-line pb-4 max-sm:mb-6">
        <p className="kicker flex items-center gap-3 text-ink">
          {index && (
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-accent px-2 text-[11px] text-accent-text">
              {index}
            </span>
          )}
          {label}
        </p>
        <p className="kicker ml-auto hidden text-right text-faint sm:block">{meta}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-14">
        <h2
          className={`font-display text-[clamp(38px,6.2vw,76px)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink ${
            lede ? "" : "lg:col-span-2"
          }`}
        >
          <StaggerText text={title} />
        </h2>
        {lede && (
          <p className="max-w-[38em] text-[16px] leading-relaxed text-muted lg:pb-2">{lede}</p>
        )}
      </div>
    </div>
  );
}
