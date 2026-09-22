import type { ManaColor } from "@/features/game/gameTypes";

export const MANA_COLORS: ManaColor[] = ["w", "u", "b", "r", "g"];

export const MANA_LABELS: Record<ManaColor, string> = {
  w: "Blanca",
  u: "Azul",
  b: "Negra",
  r: "Roja",
  g: "Verde",
};

export function isManaColor(value: unknown): value is ManaColor {
  return typeof value === "string" && MANA_COLORS.includes(value as ManaColor);
}
