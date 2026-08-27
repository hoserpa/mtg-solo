import { useState, useCallback, useRef } from "react";
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

const initialConfig = getDefaultConfig("easy");

const initialState: AppState = {
  screen: "home",
  config: initialConfig,
  game: null,
};

export function useGame() {
  const [state, setState] = useState<AppState>(initialState);
  const rngRef = useRef<RandomGenerator>(createRandomGenerator());

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, screen }));
  }, []);

  const setConfig = useCallback((config: GameConfig) => {
    setState((prev) => ({ ...prev, config }));
  }, []);

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
