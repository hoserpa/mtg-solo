import { describe, it, expect } from "vitest";
import { validateGameConfig } from "../validation";
import type { GameConfig } from "@/features/game/gameTypes";

const validConfig: GameConfig = {
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
  enabledEventIds: ["damage-3"],
};

describe("validateGameConfig", () => {
  it("acepta una configuración válida", () => {
    const result = validateGameConfig(validConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rechaza vida del jugador <= 0", () => {
    const config = { ...validConfig, playerInitialLife: 0 };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("jugador"))).toBe(true);
  });

  it("rechaza vida de la CPU <= 0", () => {
    const config = { ...validConfig, cpuInitialLife: -5 };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("CPU"))).toBe(true);
  });

  it("rechaza turnsPerRound < 1", () => {
    const config = { ...validConfig, turnsPerRound: 0 };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(false);
  });

  it("rechaza probabilidad fuera de rango", () => {
    const config = {
      ...validConfig,
      eventFrequency: { type: "chance" as const, probability: 1.5 },
    };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(false);
  });

  it("rechaza eventos activados sin IDs habilitados", () => {
    const config = { ...validConfig, enabledEventIds: [] };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(false);
  });

  it("acepta eventos desactivados sin IDs", () => {
    const config = {
      ...validConfig,
      eventsEnabled: false,
      enabledEventIds: [],
    };
    const result = validateGameConfig(config);
    expect(result.valid).toBe(true);
  });
});
