"use client";

/**
 * ASCII Portrait — built on the ASCII engine from Vengeance UI's
 * `animated-footer`: an image is sampled into a grid of glyphs on <canvas>,
 * cells light up in small wandering clusters around the cursor, and the whole
 * piece drifts with a soft pointer parallax.
 *
 * Adapted to a single image, brand colours, a contrast stretch (so a casual
 * photo still reads), an optional square crop, DPR-aware drawing and a static
 * render for reduced-motion users.
 */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const RAMP = " .:-=+*#%@";
const HIGHLIGHT_LIFETIME = 320;
const CLUSTER_SIZE = 9;

type Cell = { col: number; row: number; char: string; weight: number; until: number };

export default function AsciiPortrait({
  src,
  alt,
  columns = 64,
  crop,
  charColor = "#b9f12f",
  hoverColor = "#b9f12f",
  hoverCharColor = "#0b3048",
  className,
}: {
  src: string;
  alt: string;
  columns?: number;
  /** Source crop in image pixels: [x, y, size] (square). */
  crop?: [number, number, number];
  charColor?: string;
  hoverColor?: string;
  hoverCharColor?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cells: Cell[] = [];
    const byKey = new Map<string, Cell>();
    const rows = columns;
    let cellSize = 8;
    let raf = 0;
    let disposed = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    const build = () => {
      const sampler = document.createElement("canvas");
      sampler.width = columns;
      sampler.height = rows;
      const sctx = sampler.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      const [cx, cy, cs] = crop ?? [0, 0, Math.min(img.naturalWidth, img.naturalHeight)];
      sctx.drawImage(img, cx, cy, cs, cs, 0, 0, columns, rows);
      const px = sctx.getImageData(0, 0, columns, rows).data;

      // Luma per cell, then a percentile contrast stretch.
      const luma: number[] = [];
      for (let i = 0; i < columns * rows; i++) {
        luma.push((px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255);
      }
      const sorted = [...luma].sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.04)];
      const hi = sorted[Math.floor(sorted.length * 0.9)];

      // Sobel edges on the stretched luma: features (eyes, nose, jaw, beard
      // line) read far better as edges than as flat tone alone.
      const at = (c: number, r: number) => {
        const cc = Math.min(columns - 1, Math.max(0, c));
        const rr = Math.min(rows - 1, Math.max(0, r));
        return Math.min(1, Math.max(0, (luma[rr * columns + cc] - lo) / (hi - lo || 1)));
      };
      const edges: number[] = [];
      let maxEdge = 0;
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          const gx =
            at(col + 1, row - 1) + 2 * at(col + 1, row) + at(col + 1, row + 1) -
            at(col - 1, row - 1) - 2 * at(col - 1, row) - at(col - 1, row + 1);
          const gy =
            at(col - 1, row + 1) + 2 * at(col, row + 1) + at(col + 1, row + 1) -
            at(col - 1, row - 1) - 2 * at(col, row - 1) - at(col + 1, row - 1);
          const e = Math.sqrt(gx * gx + gy * gy);
          edges.push(e);
          if (e > maxEdge) maxEdge = e;
        }

      cells = [];
      byKey.clear();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const b = at(col, row);
          const e = edges[row * columns + col] / (maxEdge || 1);
          // Soft circular vignette so the portrait floats inside its card.
          const dx = (col + 0.5) / columns - 0.5;
          const dy = (row + 0.5) / rows - 0.5;
          const vig = Math.max(0, 1 - Math.pow(Math.sqrt(dx * dx + dy * dy) / 0.58, 4));
          // Dark tone fills, edges sharpen.
          const weight = Math.min(1, (Math.pow(1 - b, 1.9) * 0.38 + Math.pow(e, 0.7) * 1.05) * vig);
          const idx = Math.min(RAMP.length - 1, Math.floor(weight * RAMP.length));
          if (idx <= 1) continue;
          const cell = { col, row, char: RAMP[idx], weight, until: 0 };
          cells.push(cell);
          byKey.set(`${col},${row}`, cell);
        }
      }
    };

    const resize = () => {
      const size = wrap.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cellSize = size / columns;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const size = wrap.clientWidth;
      ctx.clearRect(0, 0, size, size);
      ctx.font = `500 ${cellSize * 1.05}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const now = performance.now();
      const ox = pointer.x;
      const oy = pointer.y;
      for (const c of cells) {
        const x = c.col * cellSize + ox;
        const y = c.row * cellSize + oy;
        if (c.until > now) {
          ctx.fillStyle = hoverColor;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.fillStyle = hoverCharColor;
        } else {
          ctx.globalAlpha = 0.35 + c.weight * 0.65;
          ctx.fillStyle = charColor;
        }
        ctx.fillText(c.char, x + cellSize / 2, y + cellSize / 2 + 0.5);
        ctx.globalAlpha = 1;
      }
    };

    const light = (start: Cell) => {
      const now = performance.now();
      start.until = now + HIGHLIGHT_LIFETIME;
      let cur = start;
      const lit = new Set([start]);
      const steps = 1 + Math.floor(Math.random() * CLUSTER_SIZE);
      for (let s = 0; s < steps; s++) {
        const near: Cell[] = [];
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const n = byKey.get(`${cur.col + dx},${cur.row + dy}`);
            if (n && !lit.has(n)) near.push(n);
          }
        if (!near.length) break;
        cur = near[Math.floor(Math.random() * near.length)];
        cur.until = now + HIGHLIGHT_LIFETIME + s * 12;
        lit.add(cur);
      }
    };

    // Animate only while something is moving; idle portraits cost nothing.
    const loop = () => {
      if (disposed) return;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      draw();
      const now = performance.now();
      const settling =
        Math.abs(pointer.tx - pointer.x) > 0.05 || Math.abs(pointer.ty - pointer.y) > 0.05;
      if (pointer.inside || settling || cells.some((c) => c.until > now)) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      pointer.tx = (mx / r.width - 0.5) * -10;
      pointer.ty = (my / r.height - 0.5) * -10;
      const cell = byKey.get(`${Math.floor(mx / cellSize)},${Math.floor(my / cellSize)}`);
      if (cell) light(cell);
      pointer.inside = true;
      kick();
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.tx = 0;
      pointer.ty = 0;
      kick();
    };

    img.onload = () => {
      if (disposed) return;
      build();
      resize();
      if (!reduce) {
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
      }
    };

    const ro = new ResizeObserver(() => cells.length && resize());
    ro.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [src, columns, crop, charColor, hoverColor, hoverCharColor]);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      <canvas ref={canvasRef} role="img" aria-label={alt} className="block" />
    </div>
  );
}
