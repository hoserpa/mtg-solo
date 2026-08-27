import type { GameConfig } from "@/features/game/gameTypes";

export const TURNS_PER_ROUND = 2;

export const DIFFICULTY_PRESETS: Record<string, GameConfig> = {
  easy: {
    mode: "easy",
    playerInitialLife: 20,
    cpuInitialLife: 20,
    turnsEnabled: true,
    roundsEnabled: true,
    turnsPerRound: TURNS_PER_ROUND,
    maxRounds: 0,
    eventsEnabled: false,
    eventFrequency: { type: "chance", probability: 0 },
    maxConsecutiveEvents: 0,
    enabledEventIds: [],
  },
  medium: {
    mode: "medium",
    playerInitialLife: 20,
    cpuInitialLife: 20,
    turnsEnabled: true,
    roundsEnabled: true,
    turnsPerRound: TURNS_PER_ROUND,
    maxRounds: 20,
    eventsEnabled: false,
    eventFrequency: { type: "chance", probability: 0 },
    maxConsecutiveEvents: 0,
    enabledEventIds: [],
  },
  hard: {
    mode: "hard",
    playerInitialLife: 20,
    cpuInitialLife: 20,
    turnsEnabled: true,
    roundsEnabled: true,
    turnsPerRound: TURNS_PER_ROUND,
    maxRounds: 20,
    eventsEnabled: true,
    eventFrequency: { type: "chance", probability: 1.0 },
    maxConsecutiveEvents: 99,
    enabledEventIds: [
      "damage-3",
      "damage-2",
      "lose-life-2",
      "cpu-gain-life-4",
      "discard-1",
      "discard-2",
      "destroy-card-1",
      "destroy-card-2",
      "destroy-card-3",
      "cannot-attack",
      "destroy-permanent-1",
      "sacrifice-1",
      "cannot-block",
    ],
  },
};

export function getDefaultConfig(mode: string): GameConfig {
  const preset = DIFFICULTY_PRESETS[mode];
  if (!preset) {
    return DIFFICULTY_PRESETS.easy;
  }
  return { ...preset };
}

export const DEFAULT_MAX_ROUNDS = 10;
