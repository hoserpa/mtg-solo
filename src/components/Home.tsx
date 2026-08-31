import styles from "./Home.module.css";

type HomeProps = {
  onNewGame: () => void;
};

export function Home({ onNewGame }: HomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <img
          className={styles.logo}
          src={`${import.meta.env.BASE_URL}logo_v1.png`}
          alt="MTG Practice"
          width={280}
          height={164}
        />
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
