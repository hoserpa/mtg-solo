import type { EventFrequency } from "@/features/events/eventTypes";

export type Difficulty = "easy" | "medium" | "hard" | "custom";

export type GameConfig = {
  mode: Difficulty;
  playerInitialLife: number;
  cpuInitialLife: number;
  turnsEnabled: boolean;
  roundsEnabled: boolean;
  turnsPerRound: number;
  maxRounds: number;
  eventsEnabled: boolean;
  eventFrequency: EventFrequency;
  maxConsecutiveEvents: number;
  enabledEventIds: string[];
};

export type GameStatus = "setup" | "playing" | "won" | "lost" | "draw";

export type GameState = {
  status: GameStatus;
  playerLife: number;
  cpuLife: number;
  turn: number;
  round: number;
  currentEvent: ActiveEvent | null;
  restrictions: Restriction[];
  eventHistory: EventHistoryEntry[];
  startedAt: string;
  endedAt?: string;
};

export type ActiveEvent = {
  eventId: string;
  generatedAtTurn: number;
  resolved: boolean;
};

export type Restriction = {
  type: string;
  remainingTurns: number;
};

export type EventHistoryEntry = {
  turn: number;
  round: number;
  eventId: string;
  timestamp: string;
};

export type Stats = {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalTurns: number;
  totalEvents: number;
};

export type GameAction =
  | { type: "START_GAME"; config: GameConfig; state: GameState }
  | { type: "NEXT_TURN" }
  | { type: "PLAYER_LIFE_CHANGE"; amount: number }
  | { type: "CPU_LIFE_CHANGE"; amount: number }
  | { type: "RESOLVE_EVENT" }
  | { type: "RESET_GAME" };
