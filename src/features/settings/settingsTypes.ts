import type { GameConfig } from "@/features/game/gameTypes";

export type Statistics = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalTurns: number;
  totalEvents: number;
};

export type StoredSettings = {
  config: GameConfig;
  stats: Statistics;
};

export type PersistedData = {
  version: number;
  settings: StoredSettings;
};

export const CURRENT_SETTINGS_VERSION = 1;

export const STORAGE_KEY = "mtg-practice-settings";
