import type { EventDefinition } from "./eventTypes";
import { INITIAL_EVENTS } from "@/data/events";

const registry = new Map<string, EventDefinition>();

for (const event of INITIAL_EVENTS) {
  registry.set(event.id, event);
}

export function getEventById(id: string): EventDefinition | undefined {
  return registry.get(id);
}

export function getAllEvents(): EventDefinition[] {
  return Array.from(registry.values());
}
