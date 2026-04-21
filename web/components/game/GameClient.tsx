"use client";

import { useCallback, useState } from "react";
import { BattleArena } from "@/components/game/BattleArena";
import { useLevelProgress } from "@/hooks/useLevelProgress";
import { LEVELS, type LevelConfig } from "@/lib/gameLevels";

type Screen =
  | "home"
  | "levels"
  | "playing"
  | "win"
  | "lose"
  | "campaignDone";

export function GameClient() {
  const { maxUnlockedLevel, unlockNextLevel, hydrated } = useLevelProgress();
  const [screen, setScreen] = useState<Screen>("home");
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [lastResultLevel, setLastResultLevel] = useState<LevelConfig | null>(
    null,
  );

  const startLevel = useCallback((level: LevelConfig) => {
    setActiveLevel(level);
    setScreen("playing");
  }, []);

  const handleWin = useCallback(() => {
    if (!activeLevel) return;
    unlockNextLevel(activeLevel.id);
    setLastResultLevel(activeLevel);
    setScreen("win");
    setActiveLevel(null);
  }, [activeLevel, unlockNextLevel]);

  const handleLose = useCallback(() => {
    if (!activeLevel) return;
    setLastResultLevel(activeLevel);
    setScreen("lose");
    setActiveLevel(null);
  }, [activeLevel]);

  const goNextLevel = useCallback(() => {
    if (!lastResultLevel) return;
    const next = LEVELS.find((l) => l.id === lastResultLevel.id + 1);
    if (!next) {
      setScreen("campaignDone");
      return;
    }
    startLevel(next);
  }, [lastResultLevel, startLevel]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center font-mono text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-lg px-4 pb-28 pt-6">
      <header className="mb-8 text-center">
        <div className="glitch-title relative inline-block font-[family-name:var(--font-orbitron)] text-2xl font-black uppercase tracking-[0.12em] text-neon-cyan sm:text-3xl">
          <span
            className="relative z-10 drop-shadow-[0_0_18px_rgba(0,245,255,0.55)]"
            data-text="Simple Battle Royale"
          >
            Simple Battle Royale
          </span>
        </div>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.35em] text-zinc-500">
          Swipe the arena · Survive the collapse
        </p>
      </header>

      {screen === "home" && (
        <div className="flex flex-col items-center gap-6">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-80" />
          <button
            type="button"
            onClick={() => setScreen("levels")}
            className="w-full max-w-xs rounded border border-neon-cyan/60 bg-neon-cyan/10 py-4 font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-widest text-neon-cyan shadow-[0_0_24px_rgba(0,245,255,0.35)] transition hover:bg-neon-cyan/20"
          >
            Play
          </button>
          <p className="max-w-sm text-center font-mono text-[11px] leading-relaxed text-zinc-500">
            Stay inside the neon ring. Hunters chase you — keep moving with
            swipe momentum.
          </p>
        </div>
      )}

      {screen === "levels" && (
        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-[0.25em] text-neon-magenta">
            Sectors
          </h2>
          <ul className="flex flex-col gap-2">
            {LEVELS.map((lvl) => {
              const locked = lvl.id > maxUnlockedLevel;
              return (
                <li key={lvl.id}>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => startLevel(lvl)}
                    className="flex w-full items-center justify-between rounded border border-zinc-700 bg-black/40 px-4 py-3 text-left font-mono text-sm transition hover:border-neon-cyan/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="text-zinc-200">
                      {lvl.id}. {lvl.name}
                    </span>
                    <span className="text-[10px] uppercase text-zinc-500">
                      {locked ? "Locked" : "Enter"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setScreen("home")}
            className="mt-4 font-mono text-xs uppercase text-zinc-500 underline-offset-4 hover:text-zinc-300"
          >
            Back
          </button>
        </div>
      )}

      {screen === "playing" && activeLevel && (
        <BattleArena
          key={activeLevel.id}
          level={activeLevel}
          onWin={handleWin}
          onLose={handleLose}
        />
      )}

      {screen === "win" && lastResultLevel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="w-full max-w-sm border border-neon-cyan/50 bg-cyber-surface p-6 shadow-[0_0_40px_rgba(0,245,255,0.2)]">
            <p className="font-[family-name:var(--font-orbitron)] text-lg font-bold uppercase text-neon-cyan">
              Sector cleared
            </p>
            <p className="mt-2 font-mono text-sm text-zinc-300">
              Level {lastResultLevel.id} — {lastResultLevel.name}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {lastResultLevel.id < LEVELS.length ? (
                <button
                  type="button"
                  onClick={goNextLevel}
                  className="rounded border border-neon-magenta/60 bg-neon-magenta/15 py-3 font-mono text-xs uppercase tracking-wider text-neon-magenta"
                >
                  Next level
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setScreen("campaignDone")}
                  className="rounded border border-neon-magenta/60 bg-neon-magenta/15 py-3 font-mono text-xs uppercase tracking-wider text-neon-magenta"
                >
                  Finish
                </button>
              )}
              <button
                type="button"
                onClick={() => setScreen("levels")}
                className="rounded border border-zinc-600 py-3 font-mono text-xs uppercase text-zinc-300"
              >
                Level select
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "lose" && lastResultLevel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="w-full max-w-sm border border-red-500/40 bg-cyber-surface p-6">
            <p className="font-[family-name:var(--font-orbitron)] text-lg font-bold uppercase text-red-400">
              Eliminated
            </p>
            <p className="mt-2 font-mono text-sm text-zinc-400">
              The storm took you out in {lastResultLevel.name}.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => startLevel(lastResultLevel)}
                className="rounded border border-neon-cyan/50 bg-neon-cyan/10 py-3 font-mono text-xs uppercase text-neon-cyan"
              >
                Retry sector
              </button>
              <button
                type="button"
                onClick={() => setScreen("levels")}
                className="rounded border border-zinc-600 py-3 font-mono text-xs uppercase text-zinc-300"
              >
                Level select
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === "campaignDone" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md">
          <div className="w-full max-w-sm border border-neon-cyan/40 bg-cyber-surface p-6 text-center">
            <p className="font-[family-name:var(--font-orbitron)] text-xl font-black uppercase text-neon-cyan">
              Protocol mastered
            </p>
            <p className="mt-3 font-mono text-sm text-zinc-400">
              You survived every collapse. Run it again anytime.
            </p>
            <button
              type="button"
              onClick={() => setScreen("levels")}
              className="mt-6 w-full rounded border border-neon-magenta/50 py-3 font-mono text-xs uppercase text-neon-magenta"
            >
              Replay sectors
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
