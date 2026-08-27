import type { EventDefinition } from "./eventTypes";
import type { RandomGenerator } from "@/lib/random";

export function selectWeightedEvent(
  events: EventDefinition[],
  rng: RandomGenerator,
): EventDefinition | null {
  const enabled = events.filter((e) => e.enabled && e.weight > 0);
  if (enabled.length === 0) return null;

  const totalWeight = enabled.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) return null;

  let random = rng.next() * totalWeight;

  for (const event of enabled) {
    random -= event.weight;
    if (random <= 0) return event;
  }

  return enabled[enabled.length - 1];
}

export function filterEventsForConfig(
  events: EventDefinition[],
  enabledIds: string[],
): EventDefinition[] {
  return events.filter((e) => enabledIds.includes(e.id));
}
