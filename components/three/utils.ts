export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function entrance(elapsed: number, delay = 0, duration = 1.1) {
  return easeOutCubic(clamp01((elapsed - delay) / duration));
}
