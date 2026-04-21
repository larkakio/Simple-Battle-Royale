"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENEMY_RADIUS,
  FRICTION,
  initialZoneRadius,
  LEVELS,
  MIN_ZONE_RADIUS,
  PLAYER_ACCEL,
  PLAYER_MAX_SPEED,
  PLAYER_RADIUS,
  WORLD,
  WORLD_CENTER,
  type LevelConfig,
} from "@/lib/gameLevels";

type BattleArenaProps = {
  level: LevelConfig;
  onWin: () => void;
  onLose: () => void;
};

type Enemy = { x: number; y: number };

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function BattleArena({ level, onWin, onLose }: BattleArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const endedRef = useRef(false);
  const onWinRef = useRef(onWin);
  const onLoseRef = useRef(onLose);
  onWinRef.current = onWin;
  onLoseRef.current = onLose;

  const playerRef = useRef({
    x: WORLD_CENTER.x,
    y: WORLD_CENTER.y,
    vx: 0,
    vy: 0,
  });
  const zoneRRef = useRef(initialZoneRadius(level));
  const hpRef = useRef(100);
  const timeRef = useRef(0);
  const enemiesRef = useRef<Enemy[]>([]);
  const pointerRef = useRef({ active: false, lx: 0, ly: 0 });

  const [hud, setHud] = useState({
    hp: 100,
    time: 0,
    zone: zoneRRef.current,
    threat: 0,
  });

  const resetSimulation = useCallback(() => {
    endedRef.current = false;
    hpRef.current = 100;
    timeRef.current = 0;
    zoneRRef.current = initialZoneRadius(level);
    playerRef.current = {
      x: WORLD_CENTER.x,
      y: WORLD_CENTER.y,
      vx: 0,
      vy: 0,
    };
    const enemies: Enemy[] = [];
    for (let i = 0; i < level.enemyCount; i++) {
      const angle = (Math.PI * 2 * i) / level.enemyCount + 0.2;
      const dist = zoneRRef.current * 0.75;
      enemies.push({
        x: WORLD_CENTER.x + Math.cos(angle) * dist,
        y: WORLD_CENTER.y + Math.sin(angle) * dist,
      });
    }
    enemiesRef.current = enemies;
    setHud({
      hp: 100,
      time: 0,
      zone: zoneRRef.current,
      threat: 0,
    });
  }, [level]);

  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const p = playerRef.current;
      const zr = zoneRRef.current;

      p.vx *= FRICTION;
      p.vy *= FRICTION;

      const speed = Math.hypot(p.vx, p.vy);
      if (speed > PLAYER_MAX_SPEED) {
        const s = PLAYER_MAX_SPEED / speed;
        p.vx *= s;
        p.vy *= s;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.x = clamp(p.x, PLAYER_RADIUS, WORLD - PLAYER_RADIUS);
      p.y = clamp(p.y, PLAYER_RADIUS, WORLD - PLAYER_RADIUS);

      zoneRRef.current = Math.max(
        MIN_ZONE_RADIUS,
        zr - level.shrinkPerSec * dt,
      );

      const distCenter = Math.hypot(p.x - WORLD_CENTER.x, p.y - WORLD_CENTER.y);
      if (distCenter > zoneRRef.current) {
        hpRef.current -= level.stormDamagePerSec * dt;
      }

      for (const e of enemiesRef.current) {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const len = Math.hypot(dx, dy) || 1;
        e.x += (dx / len) * level.enemySpeed * dt;
        e.y += (dy / len) * level.enemySpeed * dt;
        e.x = clamp(e.x, ENEMY_RADIUS, WORLD - ENEMY_RADIUS);
        e.y = clamp(e.y, ENEMY_RADIUS, WORLD - ENEMY_RADIUS);

        const d = Math.hypot(p.x - e.x, p.y - e.y);
        if (d < PLAYER_RADIUS + ENEMY_RADIUS) {
          hpRef.current -= level.contactDamagePerSec * dt;
        }
      }

      timeRef.current += dt;

      const maxT = LEVELS.find((l) => l.id === level.id)?.durationSec ?? level.durationSec;
      const threat = clamp(
        1 - zoneRRef.current / initialZoneRadius(level),
        0,
        1,
      );

      setHud({
        hp: Math.max(0, hpRef.current),
        time: timeRef.current,
        zone: zoneRRef.current,
        threat,
      });

      if (hpRef.current <= 0) {
        endedRef.current = true;
        onLoseRef.current();
        return;
      }

      if (timeRef.current >= maxT) {
        endedRef.current = true;
        onWinRef.current();
        return;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width, height) / WORLD;
      const ox = (width - WORLD * scale) / 2;
      const oy = (height - WORLD * scale) / 2;
      const sx = (x: number) => x * scale + ox;
      const sy = (y: number) => y * scale + oy;

      const cx = sx(WORLD_CENTER.x);
      const cy = sy(WORLD_CENTER.y);
      const screenR = zoneRRef.current * scale;

      ctx.fillStyle = "rgba(255,0,60,0.22)";
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.arc(cx, cy, screenR, 0, Math.PI * 2, true);
      ctx.fill("evenodd");

      ctx.strokeStyle = "rgba(0,245,255,0.85)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, screenR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      for (const e of enemiesRef.current) {
        ctx.fillStyle = "rgba(255,0,170,0.9)";
        ctx.beginPath();
        ctx.arc(sx(e.x), sy(e.y), ENEMY_RADIUS * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(sx(p.x), sy(p.y), PLAYER_RADIUS * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    });
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current = {
      active: true,
      lx: e.clientX,
      ly: e.clientY,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointerRef.current.active) return;
    const dx = e.clientX - pointerRef.current.lx;
    const dy = e.clientY - pointerRef.current.ly;
    pointerRef.current.lx = e.clientX;
    pointerRef.current.ly = e.clientY;

    const p = playerRef.current;
    p.vx += dx * PLAYER_ACCEL;
    p.vy += dy * PLAYER_ACCEL;
  }

  function onPointerUp(e: React.PointerEvent) {
    pointerRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  const remaining = Math.max(0, level.durationSec - hud.time);

  return (
    <div className="relative flex h-[min(72vh,520px)] w-full max-w-lg flex-col">
      <div className="pointer-events-none absolute left-3 top-3 z-10 h-20 w-20 rounded-full border border-neon-cyan/40 bg-black/50 p-1 shadow-[0_0_20px_rgba(0,245,255,0.2)]">
        <div className="relative h-full w-full rounded-full border border-zinc-700">
          <div
            className="absolute bottom-1/2 left-1/2 h-[42%] w-0.5 origin-bottom bg-neon-cyan/80"
            style={{
              transform: `translate(-50%, 0) rotate(${hud.threat * 160 - 80}deg)`,
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-magenta shadow-[0_0_8px_#ff00aa]" />
        </div>
        <p className="mt-1 text-center font-mono text-[8px] uppercase text-zinc-500">
          Threat
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="touch-none flex-1 rounded-lg border border-neon-cyan/25 bg-black/40"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase text-zinc-400 sm:text-xs">
        <div className="rounded border border-zinc-700 bg-black/40 px-2 py-1 text-center">
          <div className="text-[9px] text-zinc-500">HP</div>
          <div className="text-neon-cyan tabular-nums">{Math.round(hud.hp)}</div>
        </div>
        <div className="rounded border border-zinc-700 bg-black/40 px-2 py-1 text-center">
          <div className="text-[9px] text-zinc-500">Time</div>
          <div className="text-neon-amber tabular-nums">
            {remaining.toFixed(1)}s
          </div>
        </div>
        <div className="rounded border border-zinc-700 bg-black/40 px-2 py-1 text-center">
          <div className="text-[9px] text-zinc-500">Zone</div>
          <div className="text-zinc-200 tabular-nums">
            {Math.round(hud.zone)}
          </div>
        </div>
      </div>
    </div>
  );
}
