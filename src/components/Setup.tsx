import type { ReactNode } from "react";
import type { GameConfig } from "@/features/game/gameTypes";
import type { EventFrequency } from "@/features/events/eventTypes";
import { getDefaultConfig, DIFFICULTY_PRESETS } from "@/data/difficulties";
import { INITIAL_EVENTS } from "@/data/events";
import SunriseIcon from "~icons/game-icons/sunrise";
import GrowthIcon from "~icons/game-icons/growth";
import DeathSkullIcon from "~icons/game-icons/death-skull";
import styles from "./Setup.module.css";

const DIFFICULTY_INFO: Record<string, { name: string; desc: string }> = {
  easy: {
    name: "Fácil",
    desc: "Practica tranquilamente. Solo vidas y turnos.",
  },
  medium: {
    name: "Medio",
    desc: "Añade presión temporal mediante rondas.",
  },
  hard: {
    name: "Difícil",
    desc: "Modo completo con eventos aleatorios y restricciones.",
  },
};

const DIFFICULTY_ICON: Record<string, { icon: ReactNode; tone: string }> = {
  easy: { icon: <SunriseIcon />, tone: "white" },
  medium: { icon: <GrowthIcon />, tone: "green" },
  hard: { icon: <DeathSkullIcon />, tone: "black" },
};

const DEFAULT_EVENT_IDS = INITIAL_EVENTS.map((e) => e.id);

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(Number.isFinite(n) ? n : min, min), max);
}

function eventProbabilityPercent(freq: EventFrequency): number {
  return freq.type === "chance" ? Math.round(freq.probability * 100) : 100;
}

type StepperFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function StepperField({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: StepperFieldProps) {
  const dec = () => onChange(clamp(value - step, min, max));
  const inc = () => onChange(clamp(value + step, min, max));

  return (
    <div className={styles.configRow}>
      <label className={styles.configLabel} htmlFor={id}>
        {label}
      </label>
      <div className={styles.stepper}>
        <button
          className={styles.stepBtn}
          onClick={dec}
          type="button"
          aria-label={`Reducir ${label}`}
        >
          −
        </button>
        <input
          id={id}
          className={styles.configInput}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
        />
        <button
          className={styles.stepBtn}
          onClick={inc}
          type="button"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

type SetupProps = {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onStart: () => void;
  onBack: () => void;
};

export function Setup({ config, onConfigChange, onStart, onBack }: SetupProps) {
  const difficulties = Object.keys(DIFFICULTY_PRESETS);
  const showRounds = config.mode === "medium" || config.mode === "hard";
  const showLife = config.mode !== "custom";
  const eventProbability = eventProbabilityPercent(config.eventFrequency);

  const setPlayerLife = (value: number) =>
    onConfigChange({ ...config, playerInitialLife: clamp(value, 1, 999) });

  const setCpuLife = (value: number) =>
    onConfigChange({ ...config, cpuInitialLife: clamp(value, 1, 999) });

  const setMaxRounds = (value: number) =>
    onConfigChange({ ...config, maxRounds: clamp(value, 0, 99) });

  const setEventsEnabled = (enabled: boolean) =>
    onConfigChange({
      ...config,
      eventsEnabled: enabled,
      enabledEventIds:
        enabled && config.enabledEventIds.length === 0
          ? DEFAULT_EVENT_IDS
          : config.enabledEventIds,
    });

  const setEventProbability = (percent: number) =>
    onConfigChange({
      ...config,
      eventFrequency: {
        type: "chance",
        probability: clamp(percent, 0, 100) / 100,
      },
    });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
          type="button"
          aria-label="Volver"
        >
          ←
        </button>
        <h1 className={styles.title}>Nueva Partida</h1>
      </div>

      <p className={styles.sectionEyebrow}>Dificultad</p>
      <div className={styles.difficulties}>
        {difficulties.map((key) => {
          const info = DIFFICULTY_INFO[key];
          if (!info) return null;
          return (
            <button
              key={key}
              className={`${styles.difficultyCard} ${config.mode === key ? styles.selected : ""}`}
              onClick={() => onConfigChange(getDefaultConfig(key))}
              type="button"
            >
              <span
                className={`${styles.manaBadge} ${styles[`manaBadge--${DIFFICULTY_ICON[key].tone}`]} ${
                  config.mode === key ? styles.selected : ""
                }`}
                aria-hidden="true"
              >
                {DIFFICULTY_ICON[key].icon}
              </span>
              <span className={styles.difficultyBody}>
                <span className={styles.difficultyName}>{info.name}</span>
                <span className={styles.difficultyDesc}>{info.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {showLife && (
        <>
          <p className={styles.sectionEyebrow}>Opciones</p>
          <div className={styles.configSection}>
            <StepperField
              id="playerLife"
              label="Vida del Jugador"
              value={config.playerInitialLife}
              min={1}
              max={999}
              step={1}
              onChange={setPlayerLife}
            />
            <StepperField
              id="cpuLife"
              label="Vida del Rival"
              value={config.cpuInitialLife}
              min={1}
              max={999}
              step={1}
              onChange={setCpuLife}
            />
          </div>
        </>
      )}

      {showRounds && (
        <>
          <p className={styles.sectionEyebrow}>Rondas</p>
          <div className={styles.configSection}>
            <StepperField
              id="maxRounds"
              label="Rondas Máximas"
              value={config.maxRounds}
              min={0}
              max={99}
              step={5}
              onChange={setMaxRounds}
            />
            <p className={styles.hint}>0 = sin límite de rondas.</p>
          </div>
        </>
      )}

      <details className={styles.advanced}>
        <summary className={styles.advancedSummary}>Opciones avanzadas</summary>
        <div className={styles.configSection}>
          <div className={styles.configRow}>
            <label className={styles.configLabel} htmlFor="eventsToggle">
              Eventos del rival
            </label>
            <input
              id="eventsToggle"
              className={styles.checkbox}
              type="checkbox"
              checked={config.eventsEnabled}
              onChange={(e) => setEventsEnabled(e.target.checked)}
            />
          </div>
          {config.eventsEnabled && (
            <div className={styles.freqRow}>
              <label className={styles.configLabel} htmlFor="eventFrequency">
                Frecuencia: {eventProbability}%
              </label>
              <input
                id="eventFrequency"
                className={styles.range}
                type="range"
                min={0}
                max={100}
                step={5}
                value={eventProbability}
                onChange={(e) => setEventProbability(Number(e.target.value))}
              />
            </div>
          )}
        </div>
      </details>

      <div className={styles.summary}>
        <p className={styles.summaryTitle}>Resumen</p>
        <div className={styles.summaryRow}>
          <span>Vidas</span>
          <span>
            {config.playerInitialLife} vs {config.cpuInitialLife}
          </span>
        </div>
        {config.roundsEnabled && (
          <div className={styles.summaryRow}>
            <span>Rondas máx</span>
            <span>
              {config.maxRounds > 0 ? config.maxRounds : "Sin límite"}
            </span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span>Eventos</span>
          <span>
            {config.eventsEnabled
              ? `Activados (${eventProbability}%)`
              : "Desactivados"}
          </span>
        </div>
      </div>

      <button className={styles.startButton} onClick={onStart} type="button">
        Comenzar
      </button>
    </div>
  );
}
