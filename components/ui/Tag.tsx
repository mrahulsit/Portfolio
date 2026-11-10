import type { ReactNode } from "react";

type TagVariant = "neutral" | "accent" | "muted";
type TagSize = "sm" | "md";

const variants: Record<TagVariant, string> = {
  neutral: "border-line-strong bg-bg text-ink-2",
  accent: "border-accent bg-accent-soft text-accent-strong",
  muted: "border-line text-faint",
};

const sizes: Record<TagSize, string> = {
  sm: "px-2.5 py-1 text-[11.5px]",
  md: "px-3 py-1.5 text-[12.5px]",
};

export default function Tag({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-ui font-[550] leading-none ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
