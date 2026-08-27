import styles from "./Home.module.css";

type HomeProps = {
  onNewGame: () => void;
};

export function Home({ onNewGame }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>MTG Practice</h1>
        <p className={styles.subtitle}>
          Entrena tus partidas contra una dificultad configurable.
        </p>
      </div>
      <button
        className={styles.newGameButton}
        onClick={onNewGame}
        type="button"
      >
        Nueva Partida
      </button>
    </div>
  );
}
