type SectionHeadProps = {
  label: string;
  meta: React.ReactNode;
  title: string;
  lede?: React.ReactNode;
};

export default function SectionHead({ label, meta, title, lede }: SectionHeadProps) {
  return (
    <div className="mb-14 grid gap-[18px] lg:grid-cols-[var(--rail-w)_1fr] lg:gap-[30px]">
      <div className="inline-block self-start border-b-2 border-accent pb-2.5 lg:border-b-0 lg:border-l-2 lg:pl-4 lg:pb-0">
        <p className="mb-1.5 text-xs font-[650] uppercase tracking-[0.14em] text-accent">
          {label}
        </p>
        <p className="hidden text-[13px] leading-snug text-faint lg:block">{meta}</p>
      </div>
      <div>
        <h2 className="mb-3 max-w-[18em] font-display text-[clamp(32px,5vw,50px)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h2>
        {lede && <p className="max-w-[40em] text-muted">{lede}</p>}
      </div>
    </div>
  );
}
