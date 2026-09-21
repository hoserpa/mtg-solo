import { describe, it, expect } from "vitest";
import {
  shouldTriggerEvent,
  calculateRoundScaledProbability,
  canTriggerConsecutiveEvent,
  calculateRoundScaledDamage,
  resolveScaledEvent,
} from "../eventEngine";
import { getEventById } from "../eventRegistry";
import type { GameState } from "@/features/game/gameTypes";
import { SeededRandom } from "@/lib/random";
import { createGameState } from "@/features/game/gameReducer";
import type { GameConfig } from "@/features/game/gameTypes";

const defaultConfig: GameConfig = {
  mode: "hard",
  playerInitialLife: 20,
  cpuInitialLife: 20,
  turnsEnabled: true,
  roundsEnabled: true,
  turnsPerRound: 2,
  maxRounds: 8,
  eventsEnabled: true,
  eventFrequency: { type: "chance", probability: 0.5 },
  maxConsecutiveEvents: 2,
  enabledEventIds: ["damage-3", "nothing"],
};

describe("shouldTriggerEvent", () => {
  it("devuelve true para everyTurn", () => {
    const state = createGameState(defaultConfig);
    const rng = new SeededRandom("test");
    const result = shouldTriggerEvent(state, { type: "everyTurn" }, rng);
    expect(result).toBe(true);
  });

  it("devuelve true cada N turnos", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      turn: 3,
    };
    const rng = new SeededRandom("test");
    const result = shouldTriggerEvent(
      state,
      { type: "everyNTurns", turns: 3 },
      rng,
    );
    expect(result).toBe(true);
  });

  it("devuelve false si no es turno múltiplo de N", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      turn: 2,
    };
    const rng = new SeededRandom("test");
    const result = shouldTriggerEvent(
      state,
      { type: "everyNTurns", turns: 3 },
      rng,
    );
    expect(result).toBe(false);
  });

  it("no dispara si hay evento activo sin resolver", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      currentEvent: {
        eventId: "damage-3",
        generatedAtTurn: 1,
        resolved: false,
      },
    };
    const rng = new SeededRandom("test");
    const result = shouldTriggerEvent(state, { type: "everyTurn" }, rng);
    expect(result).toBe(false);
  });
});

describe("calculateRoundScaledProbability", () => {
  it("usa la probabilidad base en ronda 1", () => {
    const result = calculateRoundScaledProbability(0.5, 1);
    expect(result).toBe(0.5);
  });

  it("aumenta la probabilidad en rondas superiores", () => {
    const round1 = calculateRoundScaledProbability(0.5, 1);
    const round2 = calculateRoundScaledProbability(0.5, 2);
    const round3 = calculateRoundScaledProbability(0.5, 3);
    expect(round2).toBeGreaterThan(round1);
    expect(round3).toBeGreaterThan(round2);
  });

  it("nunca supera 0.95", () => {
    const result = calculateRoundScaledProbability(0.9, 20);
    expect(result).toBe(0.95);
  });

  it("escalada correcta en ronda 2", () => {
    const result = calculateRoundScaledProbability(0.5, 2);
    expect(result).toBe(0.55);
  });
});

describe("calculateRoundScaledDamage", () => {
  it("mantiene el daño base en ronda 1", () => {
    expect(calculateRoundScaledDamage(3, 1)).toBe(3);
  });

  it("mantiene el daño base en ronda 2", () => {
    expect(calculateRoundScaledDamage(3, 2)).toBe(3);
  });

  it("aumenta +1 cada dos rondas", () => {
    expect(calculateRoundScaledDamage(3, 3)).toBe(4);
    expect(calculateRoundScaledDamage(3, 5)).toBe(5);
    expect(calculateRoundScaledDamage(3, 7)).toBe(6);
  });
});

describe("resolveScaledEvent", () => {
  it("escala el daño y la descripción de un evento de ataque", () => {
    const event = getEventById("damage-3");
    if (!event) throw new Error("evento no encontrado");
    const scaled = resolveScaledEvent(event, 5);
    expect(scaled.effect).toEqual({ type: "damagePlayer", amount: 5 });
    expect(scaled.description).toBe("El rival ataca. Recibes 5 de daño.");
  });

  it("no modifica eventos que no causan daño al jugador", () => {
    const event = getEventById("cpu-gain-life-4");
    if (!event) throw new Error("evento no encontrado");
    const scaled = resolveScaledEvent(event, 7);
    expect(scaled).toBe(event);
  });

  it("no modifica el evento base original", () => {
    const event = getEventById("damage-2");
    if (!event) throw new Error("evento no encontrado");
    resolveScaledEvent(event, 9);
    expect(event.effect).toEqual({ type: "damagePlayer", amount: 2 });
  });
});

describe("canTriggerConsecutiveEvent", () => {
  it("permite si no hay eventos recientes", () => {
    const state = createGameState(defaultConfig);
    const result = canTriggerConsecutiveEvent(state, 2);
    expect(result).toBe(true);
  });

  it("bloquea si se alcanzó el límite de eventos en turnos consecutivos", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 3,
      eventHistory: [
        { turn: 3, round: 1, eventId: "damage-3", timestamp: "" },
        { turn: 5, round: 2, eventId: "damage-2", timestamp: "" },
      ],
    };
    const result = canTriggerConsecutiveEvent(state, 2);
    expect(result).toBe(false);
  });

  it("permite de nuevo tras un turno sin evento (reinicia la racha)", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 4,
      eventHistory: [
        { turn: 3, round: 1, eventId: "damage-3", timestamp: "" },
        { turn: 5, round: 2, eventId: "damage-2", timestamp: "" },
      ],
    };
    const result = canTriggerConsecutiveEvent(state, 2);
    expect(result).toBe(true);
  });

  it("un único evento con límite 1 bloquea solo el turno inmediato", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 4,
      eventHistory: [
        { turn: 5, round: 2, eventId: "damage-3", timestamp: "" },
        { turn: 7, round: 3, eventId: "damage-2", timestamp: "" },
      ],
    };
    const result = canTriggerConsecutiveEvent(state, 1);
    expect(result).toBe(false);
  });

  it("cuenta solo eventos que no son 'nothing'", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 4,
      eventHistory: [
        { turn: 1, round: 1, eventId: "nothing", timestamp: "" },
        { turn: 7, round: 3, eventId: "damage-3", timestamp: "" },
      ],
    };
    const result = canTriggerConsecutiveEvent(state, 2);
    expect(result).toBe(true);
  });
});
