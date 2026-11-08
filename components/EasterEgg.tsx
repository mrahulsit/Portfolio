"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Check, Mail, Github, Gamepad, Play } from "lucide-react";
import { profile } from "@/lib/data";

const PHRASE = "sudo hire rahul";
const COLS = 15;

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
      aria-label="Terminal"
    >
      <div className="easter-egg__overlay" onClick={close} />
      <div className="easter-egg__terminal">
        <div className="easter-egg__header">
          <span className="easter-egg__led" />
          <span className="easter-egg__led" />
          <span className="easter-egg__led" />
          <span className="easter-egg__title">rahul@portfolio:~$</span>
          <button className="easter-egg__close" type="button" aria-label="Close" onClick={close}>
            <X size={14} />
          </button>
        </div>
        <div className="easter-egg__body" key={session}>
          <div className="easter-egg__line">
            <span className="easter-egg__prompt">$</span>
            <span className="easter-egg__cmd">{PHRASE}</span>
          </div>
          <div className="easter-egg__line easter-egg__line--output">
            <span className="easter-egg__text">Checking candidate credentials...</span>
          </div>
          {[
            "Full Stack Development",
            "React.js & Node.js",
            "TypeScript & PostgreSQL",
            "Problem Solver",
            "Team Player",
          ].map((skill) => (
            <div key={skill} className="easter-egg__line easter-egg__line--output">
              <Check size={12} className="easter-egg__check" aria-hidden />
              {skill}
            </div>
          ))}
          <div className="easter-egg__line easter-egg__line--success">
            <span className="easter-egg__badge">ACCESS GRANTED</span>
          </div>
          <div className="easter-egg__line easter-egg__line--output">
            <span className="easter-egg__text">
              <Mail size={12} aria-hidden /> Contact:{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </span>
          </div>
          <div className="easter-egg__line easter-egg__line--output">
            <span className="easter-egg__text">
              <Github size={12} aria-hidden /> GitHub:{" "}
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                @{profile.githubHandle}
              </a>
            </span>
          </div>

          <Keyhunter />

          <div className="easter-egg__line easter-egg__line--final">
            <span className="easter-egg__prompt">$</span>
            <span className="easter-egg__cursor">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* short synthesized keypress blip (stands in for the original base64 wav) */
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
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("ready");
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [tag, setTag] = useState("Eat the keys · grow your skill");

  const snake = useRef<Cell[]>([]);
  const dir = useRef<Cell>({ x: 1, y: 0 });
  const dirNext = useRef<Cell>({ x: 1, y: 0 });
  const food = useRef<Cell>({ x: 0, y: 0 });
  const running = useRef(false);
  const loop = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cell = canvas.width / COLS;
    ctx.fillStyle = "#04070f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* food (a key) */
    ctx.fillStyle = "#e3b341";
    ctx.fillRect(food.current.x * cell + 2, food.current.y * cell + 2, cell - 4, cell - 4);
    ctx.fillStyle = "#04070f";
    const kx = food.current.x * cell;
    const ky = food.current.y * cell;
    ctx.fillRect(kx + cell / 2 - 2, ky + 6, 2, cell - 12);
    ctx.fillRect(kx + 6, ky + cell / 2 - 2, cell - 12, 2);

    /* body */
    ctx.fillStyle = "#238636";
    for (const s of snake.current) {
      ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
    }
    /* head */
    const head = snake.current[0];
    if (head) {
      ctx.fillStyle = "#3fb950";
      ctx.fillRect(head.x * cell + 1, head.y * cell + 1, cell - 2, cell - 2);
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
    if (canvas && ctx) {
      ctx.fillStyle = "#04070f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f85149";
      ctx.font = 'bold 15px "SF Mono", Monaco, monospace';
      ctx.textAlign = "center";
      ctx.fillText(
        `GAME OVER — score ${scoreRef.current}`,
        canvas.width / 2,
        canvas.height / 2 - 4,
      );
    }
    setOverlayHidden(false);
    setTag(`Final score ${scoreRef.current} · press to retry`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, gameOver, placeFood]);

  const speedUp = useCallback(() => {
    if (loop.current) clearInterval(loop.current);
    const delay = Math.max(60, 150 - scoreRef.current * 6);
    loop.current = setInterval(step, delay);
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

  /* best score + initial paint */
  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem("keyhunter_best") || "0", 10) || 0;
      bestRef.current = b;
      setBest(b);
    } catch {
      /* ignore */
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "#04070f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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

  return (
    <div className="easter-game">
      <div className="easter-game__bar">
        <span className="easter-game__label">
          <Gamepad size={12} aria-hidden /> bonus: keyhunter
        </span>
        <span className="easter-game__hint">arrow keys / WASD</span>
      </div>
      <div className="easter-game__field">
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
            <Play size={12} aria-hidden /> Start game
          </button>
        </div>
      </div>
      <div className="easter-game__score">
        <span>
          score <b className="easter-game__scoreval">{score}</b>
        </span>
        <span>
          best <b className="easter-game__best">{best}</b>
        </span>
        <span className={`easter-game__status${status === "game over" ? " is-over" : ""}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
