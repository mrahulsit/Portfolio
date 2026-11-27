"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiArrowUp,
  FiCheck,
  FiDownload,
  FiGithub,
  FiMail,
  FiPlay,
  FiX,
} from "react-icons/fi";
import { profile } from "@/lib/data";

const PHRASE = "sudo hire rahul";
const COLS = 15;

const CHECKS = [
  "Full-stack development",
  "React.js · Next.js · Node.js",
  "TypeScript · PostgreSQL",
  "Ships to production",
  "Problem solver · team player",
];

// Brand palette (the canvas can't read CSS variables).
const C = {
  field: "#072233",
  grid: "rgba(242,240,233,0.05)",
  snake: "#b9f12f",
  head: "#f2f0e9",
  key: "#f2f0e9",
  keyGlyph: "#0b3048",
  over: "#b9f12f",
};

type Cell = { x: number; y: number };

export default function EasterEgg() {
  const [rendered, setRendered] = useState(false);
  const [active, setActive] = useState(false);
  const [session, setSession] = useState(0);

  const open = useCallback(() => {
    setSession((s) => s + 1);
    setRendered(true);
    requestAnimationFrame(() => {
      setActive(true);
      document.body.style.overflow = "hidden";
      blip();
    });
  }, []);

  const close = useCallback(() => {
    setActive(false);
    document.body.style.overflow = "";
    setTimeout(() => setRendered(false), 300);
  }, []);

  /* type "sudo hire rahul" anywhere to open */
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = 0;
    const onKey = (ev: KeyboardEvent) => {
      const target = ev.target as HTMLElement | null;
      if (
        ev.metaKey ||
        ev.ctrlKey ||
        ev.altKey ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }
      const now = Date.now();
      if (now - lastKeyTime > 2000) buffer = "";
      lastKeyTime = now;
      if (ev.key.length === 1) {
        buffer = (buffer + ev.key.toLowerCase()).slice(-PHRASE.length);
        if (buffer === PHRASE) {
          buffer = "";
          open();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Escape closes the terminal */
  useEffect(() => {
    if (!active) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, close]);

  if (!rendered) return null;

  return (
    <div
      className="easter-egg"
      data-active={active ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal: sudo hire rahul"
    >
      <div className="easter-egg__overlay" onClick={close} />
      <div className="easter-egg__terminal">
        <div className="easter-egg__header">
          <span className="easter-egg__led" />
          <span className="easter-egg__led" />
          <span className="easter-egg__led" />
          <span className="easter-egg__title">rahul@portfolio: ~/hire</span>
          <button className="easter-egg__close" type="button" aria-label="Close terminal" onClick={close}>
            <FiX size={16} aria-hidden />
          </button>
        </div>
        <div className="easter-egg__body" key={session}>
          <Log />
          <Keyhunter />
        </div>
      </div>
    </div>
  );
}

/** Left column: the command types itself, then the checks stream in. */
function Log() {
  // Only mounted after the phrase is typed, never on the server, so reading
  // the media query in the initializer is safe and skips the typing effect.
  const [typed, setTyped] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? PHRASE.length : 0,
  );
  const done = typed >= PHRASE.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n >= PHRASE.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 55);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="easter-egg__log">
      <p className="easter-egg__cmdline">
        <span className="easter-egg__prompt" aria-hidden>
          $
        </span>
        <span className="easter-egg__cmd">{PHRASE.slice(0, typed)}</span>
        {!done && <span className="easter-egg__caret" aria-hidden />}
      </p>

      {done && (
        <div className="easter-egg__out">
          <p className="easter-egg__line easter-egg__muted">Checking candidate credentials…</p>
          <ul className="easter-egg__checks">
            {CHECKS.map((c) => (
              <li key={c} className="easter-egg__line">
                <span className="easter-egg__tick" aria-hidden>
                  <FiCheck size={12} strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>

          <p className="easter-egg__line easter-egg__granted">
            <span className="easter-egg__badge">Access granted</span>
            <span className="easter-egg__muted">Rahul is open to software roles.</span>
          </p>

          <div className="easter-egg__line easter-egg__actions">
            <a className="easter-egg__btn easter-egg__btn--primary" href={`mailto:${profile.email}`}>
              <FiMail size={14} aria-hidden /> Email me
            </a>
            <a className="easter-egg__btn" href="/resume" target="_blank" rel="noopener noreferrer">
              <FiDownload size={14} aria-hidden /> Résumé
            </a>
            <a className="easter-egg__btn" href={profile.github} target="_blank" rel="noopener noreferrer">
              <FiGithub size={14} aria-hidden /> @{profile.githubHandle}
            </a>
          </div>

          <p className="easter-egg__line easter-egg__cmdline easter-egg__cmdline--idle">
            <span className="easter-egg__prompt" aria-hidden>
              $
            </span>
            <span className="easter-egg__caret easter-egg__caret--blink" aria-hidden />
          </p>
        </div>
      )}
    </div>
  );
}

/* best keyhunter score; the game only mounts client-side */
function readBest() {
  try {
    return parseInt(localStorage.getItem("keyhunter_best") || "0", 10) || 0;
  } catch {
    return 0;
  }
}

/* short synthesized keypress blip */
function blip() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 880;
    gain.gain.value = 0.03;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
    setTimeout(() => ctx.close(), 300);
  } catch {
    /* audio unavailable — ignore */
  }
}

/* ==========================================================================
   keyhunter — snake mini-game inside the terminal
   ========================================================================== */
function Keyhunter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [status, setStatus] = useState("ready");
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [tag, setTag] = useState("Eat the keys · grow the stack");

  const snake = useRef<Cell[]>([]);
  const dir = useRef<Cell>({ x: 1, y: 0 });
  const dirNext = useRef<Cell>({ x: 1, y: 0 });
  const food = useRef<Cell>({ x: 0, y: 0 });
  const running = useRef(false);
  const loop = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const bestRef = useRef(best);
  // `step` and `speedUp` need each other; the interval calls through this ref
  // so neither has to be declared before the other.
  const stepRef = useRef<() => void>(() => {});

  const paintField = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.fillStyle = C.field;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    const cell = size / COLS;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell + 0.5, 0);
      ctx.lineTo(i * cell + 0.5, size);
      ctx.moveTo(0, i * cell + 0.5);
      ctx.lineTo(size, i * cell + 0.5);
      ctx.stroke();
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cell = canvas.width / COLS;
    paintField(ctx, canvas.width);

    /* food: a little keycap */
    const kx = food.current.x * cell;
    const ky = food.current.y * cell;
    ctx.fillStyle = C.key;
    ctx.beginPath();
    ctx.roundRect(kx + 3, ky + 3, cell - 6, cell - 6, 3);
    ctx.fill();
    ctx.fillStyle = C.keyGlyph;
    ctx.fillRect(kx + cell / 2 - 1, ky + 7, 2, cell - 14);
    ctx.fillRect(kx + 7, ky + cell / 2 - 1, cell - 14, 2);

    /* body */
    ctx.fillStyle = C.snake;
    for (const s of snake.current.slice(1)) {
      ctx.beginPath();
      ctx.roundRect(s.x * cell + 1.5, s.y * cell + 1.5, cell - 3, cell - 3, 4);
      ctx.fill();
    }
    /* head */
    const head = snake.current[0];
    if (head) {
      ctx.fillStyle = C.head;
      ctx.beginPath();
      ctx.roundRect(head.x * cell + 1, head.y * cell + 1, cell - 2, cell - 2, 5);
      ctx.fill();
    }
  }, []);

  const placeFood = useCallback(() => {
    let free: Cell;
    do {
      free = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * COLS) };
    } while (snake.current.some((s) => s.x === free.x && s.y === free.y));
    food.current = free;
  }, []);

  const gameOver = useCallback(() => {
    running.current = false;
    if (loop.current) clearInterval(loop.current);
    try {
      localStorage.setItem("keyhunter_best", String(bestRef.current));
    } catch {
      /* ignore */
    }
    setStatus("game over");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) paintField(ctx, canvas.width);
    setOverlayHidden(false);
    setTag(`Game over — score ${scoreRef.current}`);
  }, []);

  const speedUp = useCallback(() => {
    if (loop.current) clearInterval(loop.current);
    const delay = Math.max(60, 150 - scoreRef.current * 6);
    loop.current = setInterval(() => stepRef.current(), delay);
  }, []);

  const step = useCallback(() => {
    const head = {
      x: snake.current[0].x + dirNext.current.x,
      y: snake.current[0].y + dirNext.current.y,
    };
    dir.current = dirNext.current;

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= COLS) return gameOver();
    if (snake.current.some((s) => s.x === head.x && s.y === head.y)) return gameOver();

    snake.current.unshift(head);

    if (head.x === food.current.x && head.y === food.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (scoreRef.current > bestRef.current) {
        bestRef.current = scoreRef.current;
        setBest(bestRef.current);
      }
      placeFood();
      speedUp();
    } else {
      snake.current.pop();
    }
    draw();
  }, [draw, gameOver, placeFood, speedUp]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const start = useCallback(() => {
    snake.current = [
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 },
    ];
    dir.current = { x: 1, y: 0 };
    dirNext.current = dir.current;
    scoreRef.current = 0;
    setScore(0);
    setStatus("running");
    placeFood();
    setOverlayHidden(true);
    running.current = true;
    speedUp();
    draw();
  }, [draw, placeFood, speedUp]);

  /* initial paint */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) paintField(ctx, canvas.width);
    return () => {
      if (loop.current) clearInterval(loop.current);
    };
  }, []);

  /* steering */
  useEffect(() => {
    const map: Record<string, Cell | "restart"> = {
      arrowup: { x: 0, y: -1 },
      w: { x: 0, y: -1 },
      arrowdown: { x: 0, y: 1 },
      s: { x: 0, y: 1 },
      arrowleft: { x: -1, y: 0 },
      a: { x: -1, y: 0 },
      arrowright: { x: 1, y: 0 },
      d: { x: 1, y: 0 },
      " ": "restart",
    };
    const onKey = (ev: KeyboardEvent) => {
      const k = ev.key.toLowerCase();
      const action = map[k];
      if (!action) return;
      if (action === "restart") {
        ev.preventDefault();
        if (!running.current) start();
        return;
      }
      ev.preventDefault();
      if (!running.current) return;
      if (dir.current.x + action.x === 0 && dir.current.y + action.y === 0) return;
      dirNext.current = action;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [start]);

  /* swipe steering on touch screens */
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t0 = touch.current;
    touch.current = null;
    if (!t0 || !running.current) return;
    const dx = e.changedTouches[0].clientX - t0.x;
    const dy = e.changedTouches[0].clientY - t0.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    const next = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if (dir.current.x + next.x === 0 && dir.current.y + next.y === 0) return;
    dirNext.current = next;
  };

  return (
    <div className="easter-game">
      <div className="easter-game__bar">
        <span className="easter-game__label">bonus · keyhunter</span>
        <span className="easter-game__hint">
          <span className="sr-only">Arrow keys, WASD or swipe</span>
          <span aria-hidden className="easter-game__keys">
            <kbd><FiArrowLeft size={10} /></kbd>
            <kbd><FiArrowUp size={10} /></kbd>
            <kbd><FiArrowDown size={10} /></kbd>
            <kbd><FiArrowRight size={10} /></kbd>
            <span>WASD · swipe</span>
          </span>
        </span>
      </div>
      <div className="easter-game__field" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          aria-label="Snake mini-game"
          className="easter-game__canvas"
        />
        <div className={`easter-game__overlay${overlayHidden ? " is-hidden" : ""}`}>
          <p className="easter-game__tag">{tag}</p>
          <button className="easter-game__start" type="button" onClick={start}>
            <FiPlay size={13} aria-hidden /> {status === "game over" ? "Play again" : "Start game"}
          </button>
        </div>
      </div>
      <div className="easter-game__score">
        <span>
          score <b>{score}</b>
        </span>
        <span>
          best <b>{best}</b>
        </span>
        <span className={`easter-game__status${status === "game over" ? " is-over" : ""}`}>{status}</span>
      </div>
    </div>
  );
}
