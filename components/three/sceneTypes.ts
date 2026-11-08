import type { Object3D } from "three";

export type SceneTheme = "dark" | "light";

export type UpdateCtx = {
  elapsed: number;
  dt: number;
  reduce: boolean;
  hover: number;
  entrance: number;
  scroll: number;
};

export type ScenePart = {
  object: Object3D;
  update?: (ctx: UpdateCtx) => void;
  setTheme?: (theme: SceneTheme) => void;
  dispose: () => void;
};

export const PALETTE = {
  ivory: 0xfaf8f3,
  midnight: 0x08090b,
  lime: 0xcdf22b,
} as const;

export const INK = {
  dark: 0xf2f0ea,
  light: 0x0a0b0d,
} as const;

export function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
