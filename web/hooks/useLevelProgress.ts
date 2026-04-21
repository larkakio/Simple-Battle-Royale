"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sbr-progress";

type Progress = {
  maxUnlockedLevel: number;
};

function readProgress(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 1;
    const p = JSON.parse(raw) as Progress;
    if (typeof p.maxUnlockedLevel !== "number" || Number.isNaN(p.maxUnlockedLevel))
      return 1;
    return Math.max(1, Math.floor(p.maxUnlockedLevel));
  } catch {
    return 1;
  }
}

export function useLevelProgress() {
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMaxUnlockedLevel(readProgress());
    setHydrated(true);
  }, []);

  const unlockNextLevel = useCallback((completedLevelId: number) => {
    setMaxUnlockedLevel((prev) => {
      const next = Math.max(prev, completedLevelId + 1);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ maxUnlockedLevel: next } satisfies Progress),
        );
      }
      return next;
    });
  }, []);

  return { maxUnlockedLevel, unlockNextLevel, hydrated };
}
