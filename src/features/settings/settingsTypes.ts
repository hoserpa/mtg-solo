import type { GameConfig } from "@/features/game/gameTypes";

export type Statistics = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalTurns: number;
  totalEvents: number;
};

export type Preferences = {
  reducedMotion: boolean;
};

export type StoredSettings = {
  config: GameConfig;
  preferences: Preferences;
  stats: Statistics;
};

export type PersistedData = {
  version: number;
  settings: StoredSettings;
};

export const CURRENT_SETTINGS_VERSION = 1;

export const STORAGE_KEY = "mtg-practice-settings";
