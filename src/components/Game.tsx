import { useEffect, useRef, useState } from "react";
import type { GameState, GameConfig } from "@/features/game/gameTypes";
import { getEventById } from "@/features/events/eventRegistry";
import XIcon from "~icons/lucide/x";
import HistoryIcon from "~icons/lucide/history";
import styles from "./Game.module.css";

type GameProps = {
  game: GameState;
  config: GameConfig;
  onNextTurn: () => void;
  onResolveEvent: () => void;
  onLifeChange: (target: "player" | "cpu", amount: number) => void;
  onExit: () => void;
};

export function Game({
  game,
  config,
  onNextTurn,
  onResolveEvent,
  onLifeChange,
  onExit,
}: GameProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyCloseRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (historyOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      historyCloseRef.current?.focus();
    } else {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    }
  }, [historyOpen]);

  useEffect(() => {
    if (!historyOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHistoryOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [historyOpen]);

  const activeEvent = game.currentEvent
    ? getEventById(game.currentEvent.eventId)
    : null;

  const hasUnresolvedEvent =
    game.currentEvent !== null && !game.currentEvent.resolved;

  const playerDanger = game.playerLife <= 5;
  const cpuDanger = game.cpuLife <= 5;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button
            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
            onClick={onExit}
            type="button"
            aria-label="Salir de la partida"
          >
            <XIcon />
          </button>
          {game.eventHistory.length > 0 && (
            <button
              className={`${styles.iconButton} ${styles.iconButtonPrimary}`}
              onClick={() => setHistoryOpen(true)}
              type="button"
              aria-label="Ver historial"
            >
              <HistoryIcon />
            </button>
          )}
        </div>
        {config.roundsEnabled ? (
          <span className={styles.roundInfo} aria-live="polite">
            Ronda {game.round}
            {config.maxRounds > 0 ? ` / ${config.maxRounds}` : ""}
          </span>
        ) : (
          <span className={styles.turnInfo} aria-live="polite">
            Turno {game.turn}
          </span>
        )}
      </div>

      <div className={styles.playerSection}>
        <span className={styles.playerLabel}>Rival</span>
        <span
          className={`${styles.lifeValue} ${cpuDanger ? styles.danger : ""}`}
          aria-live="polite"
          aria-label={`Vida del rival: ${game.cpuLife}`}
        >
          {game.cpuLife}
        </span>
        <div className={styles.lifeControls}>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("cpu", -5)}
            type="button"
            aria-label="Rival -5"
          >
            -5
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("cpu", -1)}
            type="button"
            aria-label="Rival -1"
          >
            -1
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("cpu", 1)}
            type="button"
            aria-label="Rival +1"
          >
            +1
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("cpu", 5)}
            type="button"
            aria-label="Rival +5"
          >
            +5
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div
        className={`${styles.eventSection} ${hasUnresolvedEvent ? styles.eventParchment : ""}`}
        aria-live="polite"
      >
        {activeEvent && game.currentEvent ? (
          <>
            <span className={styles.eventLabel}>Evento</span>
            <span className={styles.eventName}>{activeEvent.name}</span>
            <span className={styles.eventDesc}>{activeEvent.description}</span>
            {hasUnresolvedEvent && (
              <button
                className={styles.resolveButton}
                onClick={onResolveEvent}
                type="button"
                aria-label={`Resolver evento: ${activeEvent.name}`}
              >
                Resolver
              </button>
            )}
          </>
        ) : (
          <span className={styles.noEvent}>Sin evento esta ronda</span>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.playerSection}>
        <span className={styles.playerLabel}>Jugador</span>
        <span
          className={`${styles.lifeValue} ${playerDanger ? styles.danger : ""}`}
          aria-live="polite"
          aria-label={`Vida del jugador: ${game.playerLife}`}
        >
          {game.playerLife}
        </span>
        <div className={styles.lifeControls}>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("player", -5)}
            type="button"
            aria-label="Jugador -5"
          >
            -5
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("player", -1)}
            type="button"
            aria-label="Jugador -1"
          >
            -1
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("player", 1)}
            type="button"
            aria-label="Jugador +1"
          >
            +1
          </button>
          <button
            className={styles.lifeButton}
            onClick={() => onLifeChange("player", 5)}
            type="button"
            aria-label="Jugador +5"
          >
            +5
          </button>
        </div>
      </div>

      <button
        className={styles.nextTurnButton}
        onClick={onNextTurn}
        type="button"
        disabled={hasUnresolvedEvent}
      >
        Siguiente Turno
      </button>

      {historyOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setHistoryOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Historial de eventos"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="document"
            tabIndex={-1}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Historial</div>
              <button
                ref={historyCloseRef}
                className={styles.modalClose}
                onClick={() => setHistoryOpen(false)}
                type="button"
                aria-label="Cerrar historial"
              >
                <XIcon />
              </button>
            </div>
            <div className={styles.modalList}>
              {[...game.eventHistory].reverse().map((entry, i) => {
                const ev = getEventById(entry.eventId);
                return (
                  <div key={i} className={styles.historyEntry}>
                    <span className={styles.historyTurn}>
                      {config.roundsEnabled
                        ? `Ronda ${entry.round}`
                        : `Turno ${entry.turn}`}
                    </span>{" "}
                    — {ev?.name ?? entry.eventId}
                  </div>
                );
              })}
            </div>
            <button
              className={styles.modalDone}
              onClick={() => setHistoryOpen(false)}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
