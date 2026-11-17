/** Join class names, skipping falsy values (the `cn` helper Vengeance UI components expect). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
