import { useGame } from "@/hooks/useGame";
import { Home } from "@/components/Home";
import { Setup } from "@/components/Setup";
import { Game } from "@/components/Game";
import { Result } from "@/components/GameResult/Result";
import "@/styles/globals.css";

export function App() {
  const game = useGame();

  switch (game.state.screen) {
    case "home":
      return <Home onNewGame={() => game.navigate("setup")} />;
    case "setup":
      return (
        <Setup
          config={game.state.config}
          onConfigChange={game.setConfig}
          onStart={game.startGame}
          onBack={() => game.navigate("home")}
        />
      );
    case "game":
      if (!game.state.game) return null;
      return (
        <Game
          game={game.state.game}
          config={game.state.config}
          onNextTurn={game.nextTurn}
          onResolveEvent={game.resolveEvent}
          onLifeChange={(target, amount) =>
            game.dispatch({
              type:
                target === "player" ? "PLAYER_LIFE_CHANGE" : "CPU_LIFE_CHANGE",
              amount,
            })
          }
          onExit={() => {
            game.resetGame();
            game.navigate("home");
          }}
        />
      );
    case "result":
      if (!game.state.game) return null;
      return (
        <Result
          game={game.state.game}
          onPlayAgain={() => {
            game.startGame();
          }}
          onChangeConfig={() => {
            game.resetGame();
            game.navigate("setup");
          }}
        />
      );
  }
}
