import { useEffect, useRef, useState, useCallback } from "react";
import type { AppState, Screen } from "@/app/appTypes";
import type { GameConfig, GameAction } from "@/features/game/gameTypes";
import { createGameState, gameReducer } from "@/features/game/gameReducer";
import { getDefaultConfig } from "@/data/difficulties";
import {
  selectEventForRound,
  canTriggerConsecutiveEvent,
} from "@/features/events/eventEngine";
import { filterEventsForConfig } from "@/features/events/eventSelector";
import { INITIAL_EVENTS } from "@/data/events";
import { validateGameConfig } from "@/lib/validation";
import { createRandomGenerator, type RandomGenerator } from "@/lib/random";
import { getBrowserStorage } from "@/lib/browserStorage";
import {
  createSettingsStore,
  type SettingsStore,
} from "@/features/settings/settingsStore";
import { createDefaultSettings } from "@/features/settings/settingsValidation";
import type {
  Statistics,
  StoredSettings,
} from "@/features/settings/settingsTypes";

export function useGame() {
  const storeRef = useRef<SettingsStore | null>(null);
  const settingsRef = useRef<StoredSettings | null>(null);
  const rngRef = useRef<RandomGenerator>(createRandomGenerator());

  const [state, setState] = useState<AppState>(() => {
    const store = createSettingsStore(getBrowserStorage());
    storeRef.current = store;
    const stored = store.load();
    settingsRef.current = stored;
    return {
      screen: "home",
      config: stored?.config ?? getDefaultConfig("easy"),
      game: null,
    };
  });

  const persistSettings = useCallback((next: StoredSettings) => {
    settingsRef.current = next;
    storeRef.current?.save(next);
  }, []);

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, screen }));
  }, []);

  const setConfig = useCallback(
    (config: GameConfig) => {
      setState((prev) => ({ ...prev, config }));
      const current = settingsRef.current ?? createDefaultSettings(config);
      persistSettings({ ...current, config });
    },
    [persistSettings],
  );

  const startGame = useCallback(() => {
    const validation = validateGameConfig(state.config);
    if (!validation.valid) return;

    const game = createGameState(state.config);
    rngRef.current = createRandomGenerator();

    setState((prev) => ({
      ...prev,
      screen: "game",
      game,
    }));
  }, [state.config]);

  const dispatch = useCallback((action: GameAction) => {
    setState((prev) => {
      if (!prev.game) return prev;

      const newGame = gameReducer(prev.game, action, prev.config);

      if (action.type === "NEXT_TURN" && prev.config.eventsEnabled) {
        const enabledEvents = filterEventsForConfig(
          INITIAL_EVENTS,
          prev.config.enabledEventIds,
        );

        const canTrigger = canTriggerConsecutiveEvent(
          newGame,
          prev.config.maxConsecutiveEvents,
        );

        if (canTrigger) {
          const event = selectEventForRound(
            newGame,
            enabledEvents,
            prev.config.eventFrequency,
            rngRef.current,
          );

          if (event) {
            const activeEvent = {
              eventId: event.id,
              generatedAtTurn: newGame.turn,
              resolved: false,
            };

            return {
              ...prev,
              game: {
                ...newGame,
                currentEvent: activeEvent,
                eventHistory: [
                  ...newGame.eventHistory,
                  {
                    turn: newGame.turn,
                    round: newGame.round,
                    eventId: event.id,
                    timestamp: new Date().toISOString(),
                  },
                ],
              },
            };
          }
        }
      }

      const shouldShowResult =
        newGame.status === "won" ||
        newGame.status === "lost" ||
        newGame.status === "draw";

      return {
        ...prev,
        screen: shouldShowResult ? "result" : prev.screen,
        game: newGame,
      };
    });
  }, []);

  const resolveEvent = useCallback(() => {
    if (!state.game?.currentEvent) return;

    dispatch({ type: "RESOLVE_EVENT" });
  }, [state.game?.currentEvent, dispatch]);

  const nextTurn = useCallback(() => {
    dispatch({ type: "NEXT_TURN" });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
    setState((prev) => ({ ...prev, screen: "home", game: null }));
  }, [dispatch]);

  const recordedGameIdRef = useRef<string | null>(null);

  useEffect(() => {
    const game = state.game;
    if (!game) return;

    const isFinished =
      game.status === "won" || game.status === "lost" || game.status === "draw";
    if (!isFinished) return;

    if (recordedGameIdRef.current === game.startedAt) return;
    recordedGameIdRef.current = game.startedAt;

    const current = settingsRef.current ?? createDefaultSettings(state.config);
    const stats = current.stats;
    const nextStats: Statistics = {
      gamesPlayed: stats.gamesPlayed + 1,
      wins: stats.wins + (game.status === "won" ? 1 : 0),
      losses: stats.losses + (game.status === "lost" ? 1 : 0),
      draws: stats.draws + (game.status === "draw" ? 1 : 0),
      totalTurns: stats.totalTurns + game.turn,
      totalEvents: stats.totalEvents + game.eventHistory.length,
    };
    persistSettings({ ...current, stats: nextStats });
  }, [state.game, state.config, persistSettings]);

  return {
    state,
    navigate,
    setConfig,
    startGame,
    dispatch,
    resolveEvent,
    nextTurn,
    resetGame,
  };
}
