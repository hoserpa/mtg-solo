import type { GameState } from "@/features/game/gameTypes";
import styles from "./Result.module.css";

type ResultProps = {
  game: GameState;
  onPlayAgain: () => void;
  onChangeConfig: () => void;
};

const RESULT_CONFIG = {
  won: { icon: "🏆", title: "Victoria", className: styles.won },
  lost: { icon: "💀", title: "Derrota", className: styles.lost },
  draw: { icon: "🤝", title: "Empate", className: styles.draw },
} as const;

export function Result({ game, onPlayAgain, onChangeConfig }: ResultProps) {
  const config = RESULT_CONFIG[game.status as keyof typeof RESULT_CONFIG];
  if (!config) return null;

  return (
    <div className={styles.container}>
      <div className={styles.resultIcon}>{config.icon}</div>
      <h1
        className={`${styles.resultTitle} ${config.className}`}
        role="status"
        aria-live="assertive"
      >
        {config.title}
      </h1>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Rival</span>
          <span className={styles.statValue}>{game.cpuLife} vidas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Jugador</span>
          <span className={styles.statValue}>{game.playerLife} vidas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Turnos</span>
          <span className={styles.statValue}>{game.turn}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Rondas</span>
          <span className={styles.statValue}>{game.round}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Eventos</span>
          <span className={styles.statValue}>{game.eventHistory.length}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.playAgainButton}
          onClick={onPlayAgain}
          type="button"
        >
          Jugar de Nuevo
        </button>
        <button
          className={styles.changeConfigButton}
          onClick={onChangeConfig}
          type="button"
        >
          Cambiar Configuración
        </button>
      </div>
    </div>
  );
}
