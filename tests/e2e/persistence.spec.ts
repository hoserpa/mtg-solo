import { test, expect } from "@playwright/test";
import { goToSetup, startGame, selectDifficulty, resultTitle } from "./helpers";

const STORAGE_KEY = "mtg-practice-settings";

function storedSettings(page: import("@playwright/test").Page) {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
}

test("guarda la configuración al elegir dificultad", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");

  const data = await storedSettings(page);
  expect(data).not.toBeNull();
  expect(data.settings.config.mode).toBe("hard");
  expect(data.settings.config.eventsEnabled).toBe(true);
});

test("recuerda la configuración tras recargar", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");

  await page.reload();
  await page.getByRole("button", { name: "Nueva Partida" }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva Partida" }),
  ).toBeVisible();

  // La tarjeta de Difícil debe seguir seleccionada.
  const card = page.getByRole("button", { name: /Difícil/ });
  await expect(card).toHaveClass(/selected/);
});

test("registra las estadísticas al terminar una partida", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Rival -5" }).click();
  }
  await expect(resultTitle(page, "Victoria")).toBeVisible();

  const data = await storedSettings(page);
  expect(data.settings.stats.gamesPlayed).toBeGreaterThanOrEqual(1);
  expect(data.settings.stats.wins).toBeGreaterThanOrEqual(1);
});
