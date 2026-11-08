"use client";

export default function TechnicalGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
        maskImage: "radial-gradient(circle at 50% 50%, #000 32%, transparent 74%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, #000 32%, transparent 74%)",
      }}
    />
  );
}
