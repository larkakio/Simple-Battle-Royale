export type LevelConfig = {
  id: number;
  name: string;
  /** Seconds to survive to win */
  durationSec: number;
  /** Initial zone radius as fraction of arena half-size (0–1) */
  zoneStart: number;
  /** Zone radius lost per second (world units / 1000 scale) */
  shrinkPerSec: number;
  enemyCount: number;
  enemySpeed: number;
  stormDamagePerSec: number;
  contactDamagePerSec: number;
};

/** World space is 1000×1000; origin center at (500,500). */
export const WORLD = 1000;
export const WORLD_CENTER = { x: WORLD / 2, y: WORLD / 2 };

const half = WORLD / 2;

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Neon Outskirts",
    durationSec: 45,
    zoneStart: 0.42,
    shrinkPerSec: 2.8,
    enemyCount: 3,
    enemySpeed: 78,
    stormDamagePerSec: 14,
    contactDamagePerSec: 28,
  },
  {
    id: 2,
    name: "Grid Collapse",
    durationSec: 60,
    zoneStart: 0.38,
    shrinkPerSec: 3.4,
    enemyCount: 5,
    enemySpeed: 96,
    stormDamagePerSec: 18,
    contactDamagePerSec: 34,
  },
  {
    id: 3,
    name: "Core Meltdown",
    durationSec: 75,
    zoneStart: 0.34,
    shrinkPerSec: 4.1,
    enemyCount: 7,
    enemySpeed: 118,
    stormDamagePerSec: 22,
    contactDamagePerSec: 40,
  },
];

export function initialZoneRadius(config: LevelConfig): number {
  return half * config.zoneStart;
}

export const PLAYER_RADIUS = 14;
export const ENEMY_RADIUS = 12;
export const MIN_ZONE_RADIUS = 55;
export const PLAYER_MAX_SPEED = 320;
export const PLAYER_ACCEL = 1.85;
export const FRICTION = 0.88;
