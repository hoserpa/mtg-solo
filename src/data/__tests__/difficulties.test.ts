import { describe, it, expect } from "vitest";
import { DIFFICULTY_PRESETS } from "../difficulties";
import { calculateRoundScaledProbability } from "@/features/events/eventEngine";
import type { EventFrequency } from "@/features/events/eventTypes";

type Preset = (typeof DIFFICULTY_PRESETS)[keyof typeof DIFFICULTY_PRESETS];

function chanceProbability(preset: Preset): number {
  const freq = preset.eventFrequency as EventFrequency;
  return freq.type === "chance" ? freq.probability : 0;
}

describe("progresión perceptible entre dificultades", () => {
  it("facil no tiene eventos", () => {
    expect(DIFFICULTY_PRESETS.easy.eventsEnabled).toBe(false);
    expect(chanceProbability(DIFFICULTY_PRESETS.easy)).toBe(0);
  });

  it("la presión de eventos aumenta de fácil a difícil", () => {
    const medium = chanceProbability(DIFFICULTY_PRESETS.medium);
    const hard = chanceProbability(DIFFICULTY_PRESETS.hard);

    expect(DIFFICULTY_PRESETS.medium.eventsEnabled).toBe(true);
    expect(DIFFICULTY_PRESETS.hard.eventsEnabled).toBe(true);
    expect(medium).toBeGreaterThan(0);
    expect(hard).toBeGreaterThan(medium);
  });

  it("difícil encadena más eventos consecutivos que medio", () => {
    expect(DIFFICULTY_PRESETS.hard.maxConsecutiveEvents).toBeGreaterThan(
      DIFFICULTY_PRESETS.medium.maxConsecutiveEvents,
    );
  });

  it("la lista de eventos de difícil no está limitada a los ligeros", () => {
    expect(DIFFICULTY_PRESETS.medium.enabledEventIds.length).toBeLessThan(
      DIFFICULTY_PRESETS.hard.enabledEventIds.length,
    );
  });
});

describe("escalado por rondas perceptible", () => {
  it("la probabilidad sube de forma perceptible ronda a ronda en difícil", () => {
    const base = chanceProbability(DIFFICULTY_PRESETS.hard);
    const r1 = calculateRoundScaledProbability(base, 1);
    const r2 = calculateRoundScaledProbability(base, 2);
    const r4 = calculateRoundScaledProbability(base, 4);

    expect(r1).toBeGreaterThan(0);
    expect(r2).toBeGreaterThan(r1);
    expect(r4).toBeGreaterThan(r2);
  });

  it("la ronda 1 de difícil es notablemente más tranquila que rondas finales", () => {
    const base = chanceProbability(DIFFICULTY_PRESETS.hard);
    const r1 = calculateRoundScaledProbability(base, 1);
    const late = calculateRoundScaledProbability(base, 10);
    expect(r1 * 3).toBeLessThan(late);
  });

  it("el escalado no convierte el juego en azar puro (tope 0.95)", () => {
    const base = chanceProbability(DIFFICULTY_PRESETS.hard);
    const late = calculateRoundScaledProbability(base, 20);
    expect(late).toBeLessThanOrEqual(0.95);
  });
});
