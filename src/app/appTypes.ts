import type { GameConfig, GameState } from "@/features/game/gameTypes";

export type Screen = "home" | "setup" | "game" | "result";

export type AppState = {
  screen: Screen;
  config: GameConfig;
  game: GameState | null;
};
