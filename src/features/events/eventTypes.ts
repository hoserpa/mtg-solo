export type EventCategory =
  | "damage"
  | "discard"
  | "destroy"
  | "restriction"
  | "neutral"
  | "resource"
  | "combat";

export type EventResolutionMode = "automatic" | "manual";

export type EventEffect =
  | { type: "damagePlayer"; amount: number }
  | { type: "damageCpu"; amount: number }
  | { type: "gainLife"; target: "player" | "cpu"; amount: number }
  | { type: "discardCards"; amount: number }
  | { type: "destroyCards"; amount: number }
  | { type: "destroyPermanent"; permanentTypes: string[]; amount: number }
  | { type: "sacrifice"; amount: number }
  | { type: "restriction"; restriction: string; duration: number }
  | { type: "none" };

export type EventFrequency =
  | { type: "everyTurn" }
  | { type: "everyNTurns"; turns: number }
  | { type: "chance"; probability: number };

export type EventBalance = {
  minDifficulty: number;
  maxDifficulty: number;
  recommendedFrequency: "low" | "medium" | "high";
};

export type EventDefinition = {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  weight: number;
  enabled: boolean;
  effect: EventEffect;
  resolutionMode: EventResolutionMode;
  balance?: EventBalance;
};

export type WeightedEvent = {
  eventId: string;
  weight: number;
};
