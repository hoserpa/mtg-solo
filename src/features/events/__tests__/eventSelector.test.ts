import { describe, it, expect } from "vitest";
import { selectWeightedEvent, filterEventsForConfig } from "../eventSelector";
import type { EventDefinition } from "../eventTypes";
import { SeededRandom } from "@/lib/random";

const testEvents: EventDefinition[] = [
  {
    id: "damage-3",
    name: "Ataque",
    description: "Recibes 3 de daño.",
    category: "damage",
    weight: 30,
    enabled: true,
    effect: { type: "damagePlayer", amount: 3 },
    resolutionMode: "automatic",
  },
  {
    id: "nothing",
    name: "Calma",
    description: "No ocurre nada.",
    category: "neutral",
    weight: 25,
    enabled: true,
    effect: { type: "none" },
    resolutionMode: "automatic",
  },
  {
    id: "disabled-event",
    name: "Deshabilitado",
    description: "Este evento está deshabilitado.",
    category: "neutral",
    weight: 50,
    enabled: false,
    effect: { type: "none" },
    resolutionMode: "automatic",
  },
];

describe("selectWeightedEvent", () => {
  it("selecciona un evento habilitado", () => {
    const rng = new SeededRandom("test");
    const result = selectWeightedEvent(testEvents, rng);
    expect(result).not.toBeNull();
    expect(result!.enabled).toBe(true);
  });

  it("no selecciona eventos deshabilitados", () => {
    const rng = new SeededRandom("test");
    for (let i = 0; i < 20; i++) {
      const result = selectWeightedEvent(testEvents, rng);
      if (result) {
        expect(result.id).not.toBe("disabled-event");
      }
    }
  });

  it("respeta los pesos en distribución", () => {
    const events: EventDefinition[] = [
      {
        id: "common",
        name: "Común",
        description: "",
        category: "neutral",
        weight: 90,
        enabled: true,
        effect: { type: "none" },
        resolutionMode: "automatic",
      },
      {
        id: "rare",
        name: "Raro",
        description: "",
        category: "neutral",
        weight: 10,
        enabled: true,
        effect: { type: "none" },
        resolutionMode: "automatic",
      },
    ];

    const rng = new SeededRandom("distribution-test");
    const counts = { common: 0, rare: 0 };

    for (let i = 0; i < 100; i++) {
      const result = selectWeightedEvent(events, rng);
      if (result) {
        counts[result.id as keyof typeof counts]++;
      }
    }

    expect(counts.common).toBeGreaterThan(counts.rare);
  });

  it("devuelve null si no hay eventos habilitados", () => {
    const rng = new SeededRandom("test");
    const disabled: EventDefinition[] = [
      {
        id: "x",
        name: "X",
        description: "",
        category: "neutral",
        weight: 10,
        enabled: false,
        effect: { type: "none" },
        resolutionMode: "automatic",
      },
    ];
    const result = selectWeightedEvent(disabled, rng);
    expect(result).toBeNull();
  });

  it("devuelve null si la suma de pesos es 0", () => {
    const rng = new SeededRandom("test");
    const zeroWeight: EventDefinition[] = [
      {
        id: "x",
        name: "X",
        description: "",
        category: "neutral",
        weight: 0,
        enabled: true,
        effect: { type: "none" },
        resolutionMode: "automatic",
      },
    ];
    const result = selectWeightedEvent(zeroWeight, rng);
    expect(result).toBeNull();
  });
});

describe("filterEventsForConfig", () => {
  it("filtra eventos por IDs habilitados", () => {
    const result = filterEventsForConfig(testEvents, ["damage-3"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("damage-3");
  });

  it("devuelve vacío si no hay coincidencias", () => {
    const result = filterEventsForConfig(testEvents, ["nonexistent"]);
    expect(result).toHaveLength(0);
  });
});
