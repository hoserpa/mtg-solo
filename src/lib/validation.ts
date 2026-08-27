import type { GameConfig } from "@/features/game/gameTypes";
import type { EventDefinition } from "@/features/events/eventTypes";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateGameConfig(config: GameConfig): ValidationResult {
  const errors: string[] = [];

  if (config.playerInitialLife <= 0) {
    errors.push("La vida del jugador debe ser mayor que 0.");
  }
  if (config.playerInitialLife > 999) {
    errors.push("La vida del jugador no puede superar 999.");
  }
  if (config.cpuInitialLife <= 0) {
    errors.push("La vida de la CPU debe ser mayor que 0.");
  }
  if (config.cpuInitialLife > 999) {
    errors.push("La vida de la CPU no puede superar 999.");
  }
  if (config.turnsPerRound < 1) {
    errors.push("Los turnos por ronda deben ser al menos 1.");
  }
  if (config.maxConsecutiveEvents < 0) {
    errors.push("El máximo de eventos consecutivos no puede ser negativo.");
  }

  if (config.eventsEnabled) {
    if (config.enabledEventIds.length === 0) {
      errors.push(
        "Si los eventos están activados, debe haber al menos uno habilitado.",
      );
    }
    if (config.eventFrequency.type === "chance") {
      const prob = config.eventFrequency.probability;
      if (prob < 0 || prob > 1) {
        errors.push("La probabilidad de eventos debe estar entre 0 y 1.");
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateEvent(event: EventDefinition): ValidationResult {
  const errors: string[] = [];

  if (!event.id || event.id.trim() === "") {
    errors.push("El evento debe tener un id.");
  }
  if (!event.name || event.name.trim() === "") {
    errors.push("El evento debe tener un nombre.");
  }
  if (event.weight < 0) {
    errors.push("El peso del evento no puede ser negativo.");
  }

  return { valid: errors.length === 0, errors };
}
