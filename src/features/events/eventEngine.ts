import type { EventDefinition, EventFrequency } from "./eventTypes";
import type { GameState } from "../game/gameTypes";
import type { RandomGenerator } from "@/lib/random";
import { selectWeightedEvent } from "./eventSelector";

export function shouldTriggerEvent(
  state: GameState,
  frequency: EventFrequency,
  rng: RandomGenerator,
): boolean {
  if (state.currentEvent && !state.currentEvent.resolved) {
    return false;
  }

  switch (frequency.type) {
    case "everyTurn":
      return true;

    case "everyNTurns":
      return state.turn % frequency.turns === 0;

    case "chance":
      return rng.next() < frequency.probability;
  }
}

export function calculateRoundScaledProbability(
  baseProbability: number,
  currentRound: number,
): number {
  if (currentRound <= 1) return baseProbability * 0.5;

  const scaling = 1 + (currentRound - 1) * 0.5;
  const scaled = baseProbability * scaling;

  return Math.min(scaled, 0.95);
}

export function selectEventForRound(
  state: GameState,
  events: EventDefinition[],
  frequency: EventFrequency,
  rng: RandomGenerator,
): EventDefinition | null {
  const shouldTrigger = shouldTriggerEventWithScaling(state, frequency, rng);

  if (!shouldTrigger) return null;

  return selectWeightedEvent(events, rng);
}

function shouldTriggerEventWithScaling(
  state: GameState,
  frequency: EventFrequency,
  rng: RandomGenerator,
): boolean {
  if (state.currentEvent && !state.currentEvent.resolved) {
    return false;
  }

  if (frequency.type === "chance") {
    const scaledProbability = calculateRoundScaledProbability(
      frequency.probability,
      state.round,
    );
    return rng.next() < scaledProbability;
  }

  return shouldTriggerEvent(state, frequency, rng);
}

export function canTriggerConsecutiveEvent(
  state: GameState,
  maxConsecutive: number,
): boolean {
  if (maxConsecutive <= 0) return false;

  const history = state.eventHistory;
  let consecutive = 0;
  let expectedRound = state.round - 1;

  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.eventId === "nothing") break;

    if (entry.round !== expectedRound) break;

    consecutive++;
    expectedRound--;
  }

  return consecutive < maxConsecutive;
}
