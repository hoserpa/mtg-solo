import { describe, it, expect } from "vitest";
import type { GameConfig } from "@/features/game/gameTypes";
import {
  createSettingsStore,
  type StorageLike,
  type SettingsStore,
} from "../settingsStore";
import {
  createDefaultSettings,
  createDefaultStats,
  parseEventFrequency,
  parseGameConfig,
  parsePersistedData,
} from "../settingsValidation";
import type { StoredSettings } from "../settingsTypes";
import { STORAGE_KEY } from "../settingsTypes";

function createMockStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem(key) {
      return data.has(key) ? data.get(key)! : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

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

const defaultSettings: StoredSettings = createDefaultSettings(validConfig);

describe("createDefaultStats", () => {
  it("devuelve estadísticas en cero", () => {
    expect(createDefaultStats()).toEqual({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalTurns: 0,
      totalEvents: 0,
    });
  });
});

describe("createDefaultSettings", () => {
  it("crea ajustes con la configuración y estadísticas en cero", () => {
    const settings = createDefaultSettings(validConfig);
    expect(settings.config).toBe(validConfig);
    expect(settings.stats).toEqual(createDefaultStats());
    expect(settings.preferences.reducedMotion).toBe(false);
  });
});

describe("parseGameConfig", () => {
  it("acepta una configuración válida", () => {
    const parsed = parseGameConfig(validConfig);
    expect(parsed).toEqual(validConfig);
  });

  it("rechaza una configuración no objeto", () => {
    expect(parseGameConfig(null)).toBeNull();
    expect(parseGameConfig("hola")).toBeNull();
  });

  it("rechaza modo de dificultad desconocido", () => {
    const config = { ...validConfig, mode: "imposible" };
    expect(parseGameConfig(config)).toBeNull();
  });

  it("rechaza vida inválida", () => {
    expect(
      parseGameConfig({ ...validConfig, playerInitialLife: 0 }),
    ).toBeNull();
    expect(parseGameConfig({ ...validConfig, cpuInitialLife: -3 })).toBeNull();
  });

  it("rechaza turnsPerRound menor que 1", () => {
    expect(parseGameConfig({ ...validConfig, turnsPerRound: 0 })).toBeNull();
  });

  it("rechaza probabilidad de evento fuera de rango", () => {
    const config = {
      ...validConfig,
      eventFrequency: { type: "chance", probability: 1.5 },
    };
    expect(parseGameConfig(config)).toBeNull();
  });

  it("rechaza eventos habilitados que no sean array de strings", () => {
    const config = { ...validConfig, enabledEventIds: ["ok", 42] };
    expect(parseGameConfig(config)).toBeNull();
  });
});

describe("parseEventFrequency", () => {
  it("acepta frecuencia everyTurn", () => {
    expect(parseEventFrequency({ type: "everyTurn" })).toEqual({
      type: "everyTurn",
    });
  });

  it("acepta frecuencia chance dentro de rango", () => {
    expect(parseEventFrequency({ type: "chance", probability: 0.75 })).toEqual({
      type: "chance",
      probability: 0.75,
    });
  });

  it("rechaza frecuencia desconocida", () => {
    expect(parseEventFrequency({ type: "raro" })).toBeNull();
  });
});

describe("parsePersistedData", () => {
  it("acepta datos persistidos válidos", () => {
    const data = {
      version: 1,
      settings: defaultSettings,
    };
    const parsed = parsePersistedData(data);
    expect(parsed).not.toBeNull();
    expect(parsed!.version).toBe(1);
    expect(parsed!.settings.config).toEqual(validConfig);
  });

  it("rechaza datos que no son objeto", () => {
    expect(parsePersistedData("corrupto")).toBeNull();
    expect(parsePersistedData(null)).toBeNull();
    expect(parsePersistedData(undefined)).toBeNull();
  });

  it("rechaza datos sin versión", () => {
    expect(parsePersistedData({ settings: defaultSettings })).toBeNull();
  });

  it("rechaza datos con configuración inválida", () => {
    const data = {
      version: 1,
      settings: {
        ...defaultSettings,
        config: { ...validConfig, playerInitialLife: 0 },
      },
    };
    expect(parsePersistedData(data)).toBeNull();
  });
});

describe("createSettingsStore", () => {
  it("saves y vuelve a cargar ajustes", () => {
    const storage = createMockStorage();
    const store: SettingsStore = createSettingsStore(storage);

    store.save(defaultSettings);
    const loaded = store.load();

    expect(loaded).not.toBeNull();
    expect(loaded!.config).toEqual(validConfig);
    expect(loaded!.stats).toEqual(defaultSettings.stats);
    expect(storage.data.has(STORAGE_KEY)).toBe(true);
  });

  it("devuelve null al cargar sin datos guardados", () => {
    const store = createSettingsStore(createMockStorage());
    expect(store.load()).toBeNull();
  });

  it("devuelve null si hay JSON corrupto", () => {
    const storage = createMockStorage();
    storage.data.set(STORAGE_KEY, "{no soy json");
    const store = createSettingsStore(storage);
    expect(store.load()).toBeNull();
  });

  it("devuelve null si hay datos válidos JSON pero inválidos", () => {
    const storage = createMockStorage();
    storage.data.set(STORAGE_KEY, JSON.stringify({ version: 1 }));
    const store = createSettingsStore(storage);
    expect(store.load()).toBeNull();
  });

  it("no lanza error si el storage falla al escribir", () => {
    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("cuota excedida");
      },
      removeItem: () => {},
    };
    const store = createSettingsStore(failing);
    expect(() => store.save(defaultSettings)).not.toThrow();
    expect(store.load()).toBeNull();
  });

  it("borra los datos guardados con clear", () => {
    const storage = createMockStorage();
    const store = createSettingsStore(storage);
    store.save(defaultSettings);
    expect(storage.data.has(STORAGE_KEY)).toBe(true);
    store.clear();
    expect(store.load()).toBeNull();
  });
});
