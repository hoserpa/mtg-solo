import type { GameConfig, GameState, GameAction } from "./gameTypes";

export function createGameState(config: GameConfig): GameState {
  return {
    status: "playing",
    playerLife: config.playerInitialLife,
    cpuLife: config.cpuInitialLife,
    turn: 1,
    round: 1,
    currentEvent: null,
    restrictions: [],
    eventHistory: [],
    startedAt: new Date().toISOString(),
  };
}

export function calculateRound(turn: number, turnsPerRound: number): number {
  if (turnsPerRound <= 0) return 1;
  return Math.ceil(turn / turnsPerRound);
}

export function isGameOver(state: GameState): boolean {
  return state.status !== "playing";
}

export function checkGameEnd(state: GameState): GameState {
  if (state.playerLife <= 0 && state.cpuLife <= 0) {
    return { ...state, status: "draw", endedAt: new Date().toISOString() };
  }
  if (state.cpuLife <= 0) {
    return { ...state, status: "won", endedAt: new Date().toISOString() };
  }
  if (state.playerLife <= 0) {
    return { ...state, status: "lost", endedAt: new Date().toISOString() };
  }
  return state;
}

export function checkRoundLimit(
  state: GameState,
  config: GameConfig,
): GameState {
  if (
    config.roundsEnabled &&
    config.maxRounds > 0 &&
    state.round > config.maxRounds
  ) {
    if (state.status === "playing") {
      return { ...state, status: "lost", endedAt: new Date().toISOString() };
    }
  }
  return state;
}

export function applyLifeChange(
  state: GameState,
  target: "player" | "cpu",
  amount: number,
): GameState {
  const updated =
    target === "player"
      ? { ...state, playerLife: state.playerLife + amount }
      : { ...state, cpuLife: state.cpuLife + amount };

  return checkGameEnd(updated);
}

export function gameReducer(
  state: GameState,
  action: GameAction,
  config: GameConfig,
): GameState {
  if (isGameOver(state) && action.type !== "RESET_GAME") {
    return state;
  }

  switch (action.type) {
    case "START_GAME":
      return action.state;

    case "NEXT_TURN": {
      const turnsPerRound = config.turnsPerRound;
      const newTurn = state.turn + turnsPerRound;
      const newRound = config.roundsEnabled
        ? calculateRound(newTurn, config.turnsPerRound)
        : state.round;

      const expiredRestrictions = state.restrictions
        .map((r) => ({ ...r, remainingTurns: r.remainingTurns - 1 }))
        .filter((r) => r.remainingTurns > 0);

      const updatedState = {
        ...state,
        turn: newTurn,
        round: newRound,
        restrictions: expiredRestrictions,
        currentEvent: null,
      };

      return checkRoundLimit(updatedState, config);
    }

    case "PLAYER_LIFE_CHANGE":
      return applyLifeChange(state, "player", action.amount);

    case "CPU_LIFE_CHANGE":
      return applyLifeChange(state, "cpu", action.amount);

    case "RESOLVE_EVENT": {
      if (!state.currentEvent) return state;

      return {
        ...state,
        currentEvent: { ...state.currentEvent, resolved: true },
      };
    }

    case "RESET_GAME":
      return createGameState(config);

    default:
      return state;
  }
}
