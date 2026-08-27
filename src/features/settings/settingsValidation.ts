import type { Difficulty, GameConfig } from "@/features/game/gameTypes";
import type { EventFrequency } from "@/features/events/eventTypes";
import type {
  PersistedData,
  Preferences,
  Statistics,
  StoredSettings,
} from "./settingsTypes";
import { CURRENT_SETTINGS_VERSION } from "./settingsTypes";

const DIFFICULTIES: ReadonlySet<string> = new Set([
  "easy",
  "medium",
  "hard",
  "custom",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createDefaultStats(): Statistics {
  return {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalTurns: 0,
    totalEvents: 0,
  };
}

export function createDefaultPreferences(): Preferences {
  return { reducedMotion: false };
}

export function createDefaultSettings(
  config: GameConfig,
  preferences: Preferences = createDefaultPreferences(),
): StoredSettings {
  return {
    config,
    preferences,
    stats: createDefaultStats(),
  };
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && DIFFICULTIES.has(value);
}

export function parseEventFrequency(value: unknown): EventFrequency | null {
  if (!isRecord(value)) return null;

  const type = value.type;
  if (type === "everyTurn") {
    return { type: "everyTurn" };
  }
  if (type === "everyNTurns") {
    if (!isValidNumber(value.turns) || value.turns < 1) return null;
    return { type: "everyNTurns", turns: Math.floor(value.turns) };
  }
  if (type === "chance") {
    if (
      !isValidNumber(value.probability) ||
      value.probability < 0 ||
      value.probability > 1
    ) {
      return null;
    }
    return { type: "chance", probability: value.probability };
  }
  return null;
}

export function parseGameConfig(value: unknown): GameConfig | null {
  if (!isRecord(value)) return null;

  if (!isValidDifficulty(value.mode)) return null;
  if (!isValidNumber(value.playerInitialLife) || value.playerInitialLife <= 0) {
    return null;
  }
  if (!isValidNumber(value.cpuInitialLife) || value.cpuInitialLife <= 0) {
    return null;
  }
  if (typeof value.turnsEnabled !== "boolean") return null;
  if (typeof value.roundsEnabled !== "boolean") return null;
  if (!isValidNumber(value.turnsPerRound) || value.turnsPerRound < 1) {
    return null;
  }
  if (!isValidNumber(value.maxRounds) || value.maxRounds < 0) return null;
  if (typeof value.eventsEnabled !== "boolean") return null;

  const eventFrequency = parseEventFrequency(value.eventFrequency);
  if (!eventFrequency) return null;

  if (
    !isValidNumber(value.maxConsecutiveEvents) ||
    value.maxConsecutiveEvents < 0
  ) {
    return null;
  }
  if (
    !Array.isArray(value.enabledEventIds) ||
    !value.enabledEventIds.every((id) => typeof id === "string")
  ) {
    return null;
  }

  return {
    mode: value.mode,
    playerInitialLife: value.playerInitialLife,
    cpuInitialLife: value.cpuInitialLife,
    turnsEnabled: value.turnsEnabled,
    roundsEnabled: value.roundsEnabled,
    turnsPerRound: value.turnsPerRound,
    maxRounds: value.maxRounds,
    eventsEnabled: value.eventsEnabled,
    eventFrequency,
    maxConsecutiveEvents: value.maxConsecutiveEvents,
    enabledEventIds: value.enabledEventIds,
  };
}

export function parseStatistics(value: unknown): Statistics | null {
  if (!isRecord(value)) return null;

  const required: Array<keyof Statistics> = [
    "gamesPlayed",
    "wins",
    "losses",
    "draws",
    "totalTurns",
    "totalEvents",
  ];

  const result: Record<string, number> = {};
  for (const key of required) {
    const v = value[key];
    if (!isValidNumber(v) || v < 0) return null;
    result[key] = v;
  }

  return {
    gamesPlayed: result.gamesPlayed,
    wins: result.wins,
    losses: result.losses,
    draws: result.draws,
    totalTurns: result.totalTurns,
    totalEvents: result.totalEvents,
  };
}

export function parsePreferences(value: unknown): Preferences | null {
  if (!isRecord(value)) return null;
  if (typeof value.reducedMotion !== "boolean") return null;
  return { reducedMotion: value.reducedMotion };
}

function parseStoredSettings(value: unknown): StoredSettings | null {
  if (!isRecord(value)) return null;

  const config = parseGameConfig(value.config);
  if (!config) return null;

  const preferences =
    parsePreferences(value.preferences) ?? createDefaultPreferences();
  const stats = parseStatistics(value.stats) ?? createDefaultStats();

  return { config, preferences, stats };
}

export function parsePersistedData(raw: unknown): PersistedData | null {
  if (!isRecord(raw)) return null;
  if (!isValidNumber(raw.version)) return null;

  // Migraciones futuras por versión irían aquí.
  const settings = parseStoredSettings(raw.settings);
  if (!settings) return null;

  return {
    version: CURRENT_SETTINGS_VERSION,
    settings,
  };
}
