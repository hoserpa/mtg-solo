import { describe, it, expect } from "vitest";
import {
  createGameState,
  calculateRound,
  checkGameEnd,
  checkRoundLimit,
  applyLifeChange,
  gameReducer,
} from "../gameReducer";
import type { GameConfig, GameState } from "../gameTypes";
import {
  selectEventForRound,
  canTriggerConsecutiveEvent,
} from "@/features/events/eventEngine";
import { filterEventsForConfig } from "@/features/events/eventSelector";
import { INITIAL_EVENTS } from "@/data/events";
import { DIFFICULTY_PRESETS } from "@/data/difficulties";
import { SeededRandom } from "@/lib/random";

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

describe("createGameState", () => {
  it("crea un estado con vidas iniciales", () => {
    const state = createGameState(defaultConfig);
    expect(state.playerLife).toBe(20);
    expect(state.cpuLife).toBe(20);
    expect(state.status).toBe("playing");
    expect(state.turn).toBe(1);
    expect(state.round).toBe(1);
  });

  it("crea un estado con vidas personalizadas", () => {
    const config = {
      ...defaultConfig,
      playerInitialLife: 30,
      cpuInitialLife: 15,
    };
    const state = createGameState(config);
    expect(state.playerLife).toBe(30);
    expect(state.cpuLife).toBe(15);
  });
});

describe("calculateRound", () => {
  it("calcula ronda correctamente con 2 turnos por ronda", () => {
    expect(calculateRound(1, 2)).toBe(1);
    expect(calculateRound(2, 2)).toBe(1);
    expect(calculateRound(3, 2)).toBe(2);
    expect(calculateRound(4, 2)).toBe(2);
    expect(calculateRound(5, 2)).toBe(3);
  });

  it("devuelve 1 si turnsPerRound es 0", () => {
    expect(calculateRound(5, 0)).toBe(1);
  });
});

describe("checkGameEnd", () => {
  it("declara victoria cuando la vida de la CPU llega a 0", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      cpuLife: 0,
    };
    const result = checkGameEnd(state);
    expect(result.status).toBe("won");
    expect(result.endedAt).toBeDefined();
  });

  it("declara victoria cuando la vida de la CPU es negativa", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      cpuLife: -3,
    };
    const result = checkGameEnd(state);
    expect(result.status).toBe("won");
  });

  it("declara derrota cuando la vida del jugador llega a 0", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      playerLife: 0,
    };
    const result = checkGameEnd(state);
    expect(result.status).toBe("lost");
  });

  it("declara derrota cuando la vida del jugador es negativa", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      playerLife: -5,
    };
    const result = checkGameEnd(state);
    expect(result.status).toBe("lost");
  });

  it("declara empate cuando ambos llegan a 0", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      playerLife: 0,
      cpuLife: 0,
    };
    const result = checkGameEnd(state);
    expect(result.status).toBe("draw");
  });

  it("no cambia el estado si ambos siguen con vida", () => {
    const state = createGameState(defaultConfig);
    const result = checkGameEnd(state);
    expect(result.status).toBe("playing");
  });
});

describe("checkRoundLimit", () => {
  it("declara derrota al superar maxRounds", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 9,
    };
    const result = checkRoundLimit(state, defaultConfig);
    expect(result.status).toBe("lost");
    expect(result.endedAt).toBeDefined();
  });

  it("no declara derrota si round es igual a maxRounds", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 8,
    };
    const result = checkRoundLimit(state, defaultConfig);
    expect(result.status).toBe("playing");
  });

  it("no declara derrota si round es menor a maxRounds", () => {
    const state: GameState = {
      ...createGameState(defaultConfig),
      round: 5,
    };
    const result = checkRoundLimit(state, defaultConfig);
    expect(result.status).toBe("playing");
  });

  it("no aplica si roundsEnabled es false", () => {
    const config = { ...defaultConfig, roundsEnabled: false };
    const state: GameState = {
      ...createGameState(config),
      round: 999,
    };
    const result = checkRoundLimit(state, config);
    expect(result.status).toBe("playing");
  });

  it("no aplica si maxRounds es 0", () => {
    const config = { ...defaultConfig, maxRounds: 0 };
    const state: GameState = {
      ...createGameState(config),
      round: 999,
    };
    const result = checkRoundLimit(state, config);
    expect(result.status).toBe("playing");
  });
});

describe("applyLifeChange", () => {
  it("reduce la vida del jugador", () => {
    const state = createGameState(defaultConfig);
    const result = applyLifeChange(state, "player", -3);
    expect(result.playerLife).toBe(17);
  });

  it("aumenta la vida del jugador", () => {
    const state = createGameState(defaultConfig);
    const result = applyLifeChange(state, "player", 5);
    expect(result.playerLife).toBe(25);
  });

  it("reduce la vida de la CPU", () => {
    const state = createGameState(defaultConfig);
    const result = applyLifeChange(state, "cpu", -3);
    expect(result.cpuLife).toBe(17);
  });

  it("detecta victoria al reducir vida de CPU a 0", () => {
    const state = createGameState(defaultConfig);
    const result = applyLifeChange(state, "cpu", -20);
    expect(result.status).toBe("won");
    expect(result.cpuLife).toBe(0);
  });

  it("detecta derrota al reducir vida del jugador a 0", () => {
    const state = createGameState(defaultConfig);
    const result = applyLifeChange(state, "player", -20);
    expect(result.status).toBe("lost");
    expect(result.playerLife).toBe(0);
  });
});

describe("gameReducer", () => {
  describe("NEXT_TURN", () => {
    it("avanza una ronda completa (turnsPerRound turnos)", () => {
      const state = createGameState(defaultConfig);
      const result = gameReducer(state, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.turn).toBe(3);
      expect(result.round).toBe(2);
    });

    it("avanza ronda correctamente en sucesivas pulsaciones", () => {
      const state = createGameState(defaultConfig);
      let result = state;
      result = gameReducer(result, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.turn).toBe(3);
      expect(result.round).toBe(2);
      result = gameReducer(result, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.turn).toBe(5);
      expect(result.round).toBe(3);
    });

    it("no avanza ronda si roundsEnabled es false", () => {
      const config = { ...defaultConfig, roundsEnabled: false };
      const state = createGameState(config);
      let result = state;
      for (let i = 0; i < 5; i++) {
        result = gameReducer(result, { type: "NEXT_TURN" }, config);
      }
      expect(result.round).toBe(1);
      expect(result.turn).toBe(11);
    });

    it("limpia el currentEvent", () => {
      const state: GameState = {
        ...createGameState(defaultConfig),
        currentEvent: {
          eventId: "damage-3",
          generatedAtTurn: 1,
          resolved: true,
        },
      };
      const result = gameReducer(state, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.currentEvent).toBeNull();
    });

    it("limpia restricciones expiradas", () => {
      const state: GameState = {
        ...createGameState(defaultConfig),
        restrictions: [
          { type: "cannotAttack", remainingTurns: 1 },
          { type: "cannotBlock", remainingTurns: 2 },
        ],
      };
      const result = gameReducer(state, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.restrictions).toHaveLength(1);
      expect(result.restrictions[0].type).toBe("cannotBlock");
    });

    it("declara derrota al superar maxRounds", () => {
      const config = { ...defaultConfig, maxRounds: 3, turnsPerRound: 2 };
      const state: GameState = {
        ...createGameState(config),
        round: 3,
        turn: 5,
      };
      const result = gameReducer(state, { type: "NEXT_TURN" }, config);
      expect(result.status).toBe("lost");
      expect(result.round).toBe(4);
    });
  });

  describe("PLAYER_LIFE_CHANGE", () => {
    it("modifica la vida del jugador", () => {
      const state = createGameState(defaultConfig);
      const result = gameReducer(
        state,
        { type: "PLAYER_LIFE_CHANGE", amount: -5 },
        defaultConfig,
      );
      expect(result.playerLife).toBe(15);
    });
  });

  describe("CPU_LIFE_CHANGE", () => {
    it("modifica la vida de la CPU", () => {
      const state = createGameState(defaultConfig);
      const result = gameReducer(
        state,
        { type: "CPU_LIFE_CHANGE", amount: -5 },
        defaultConfig,
      );
      expect(result.cpuLife).toBe(15);
    });
  });

  describe("RESET_GAME", () => {
    it("reinicia al estado inicial", () => {
      const state = createGameState(defaultConfig);
      state.playerLife = 5;
      state.turn = 10;
      const result = gameReducer(state, { type: "RESET_GAME" }, defaultConfig);
      expect(result.playerLife).toBe(20);
      expect(result.cpuLife).toBe(20);
      expect(result.turn).toBe(1);
      expect(result.status).toBe("playing");
    });
  });

  describe("partida terminada", () => {
    it("no permite acciones en partida terminada", () => {
      const state: GameState = {
        ...createGameState(defaultConfig),
        status: "won",
      };
      const result = gameReducer(state, { type: "NEXT_TURN" }, defaultConfig);
      expect(result.turn).toBe(1);
    });

    it("permite RESET_GAME en partida terminada", () => {
      const state: GameState = {
        ...createGameState(defaultConfig),
        status: "won",
      };
      const result = gameReducer(state, { type: "RESET_GAME" }, defaultConfig);
      expect(result.status).toBe("playing");
    });
  });
});

describe("regresión: los eventos no se agotan tras el primer evento (bug 1/2)", () => {
  function simulateMediumGame(seed: string, maxRounds: number): number {
    const config = DIFFICULTY_PRESETS.medium;
    const enabledEvents = filterEventsForConfig(
      INITIAL_EVENTS,
      config.enabledEventIds,
    );
    const rng = new SeededRandom(seed);
    let state = createGameState(config);

    for (let round = 1; round <= maxRounds; round++) {
      const newGame = gameReducer(state, { type: "NEXT_TURN" }, config);
      if (newGame.status !== "playing") break;

      const canTrigger = canTriggerConsecutiveEvent(
        newGame,
        config.maxConsecutiveEvents,
      );
      if (canTrigger) {
        const event = selectEventForRound(
          newGame,
          enabledEvents,
          config.eventFrequency,
          rng,
        );
        if (event) {
          newGame.eventHistory = [
            ...newGame.eventHistory,
            {
              turn: newGame.turn,
              round: newGame.round,
              eventId: event.id,
              timestamp: "",
            },
          ];
        }
      }
      state = newGame;
    }
    return state.eventHistory.filter((e) => e.eventId !== "nothing").length;
  }

  it("una partida completa en Medio genera varios eventos, no uno solo", () => {
    let total = 0;
    for (let s = 0; s < 20; s++) {
      total += simulateMediumGame(`medio-${s}`, 20);
    }
    expect(total).toBeGreaterThan(20);
  });

  it("una partida completa en Difícil genera varios eventos, no solo dos", () => {
    const config = DIFFICULTY_PRESETS.hard;
    const enabledEvents = filterEventsForConfig(
      INITIAL_EVENTS,
      config.enabledEventIds,
    );
    let total = 0;
    for (let s = 0; s < 20; s++) {
      const rng = new SeededRandom(`duro-${s}`);
      let state = createGameState(config);
      for (let round = 1; round <= 20; round++) {
        const newGame = gameReducer(state, { type: "NEXT_TURN" }, config);
        if (newGame.status !== "playing") break;
        const canTrigger = canTriggerConsecutiveEvent(
          newGame,
          config.maxConsecutiveEvents,
        );
        if (canTrigger) {
          const event = selectEventForRound(
            newGame,
            enabledEvents,
            config.eventFrequency,
            rng,
          );
          if (event) {
            newGame.eventHistory = [
              ...newGame.eventHistory,
              {
                turn: newGame.turn,
                round: newGame.round,
                eventId: event.id,
                timestamp: "",
              },
            ];
          }
        }
        state = newGame;
      }
      total += state.eventHistory.filter((e) => e.eventId !== "nothing").length;
    }
    expect(total).toBeGreaterThan(40);
  });
});
