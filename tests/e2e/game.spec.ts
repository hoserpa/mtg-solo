import { test, expect } from "@playwright/test";
import {
  goToSetup,
  startGame,
  selectDifficulty,
  advanceTurn,
  nextTurnButton,
} from "./helpers";

test("avanza turnos y rondas en una partida Fácil", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  await expect(page.getByText(/Ronda 1/)).toBeVisible();
  await advanceTurn(page, 1);
  await expect(page.getByText(/Ronda 2/)).toBeVisible();
  await advanceTurn(page, 1);
  await expect(page.getByText(/Ronda 3/)).toBeVisible();
});

test("resuelve un evento automático y permite seguir", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");
  await startGame(page);

  // Avanzar turnos hasta que aparezca un evento (probabilidad por rondas).
  let resolved = false;
  for (let i = 0; i < 12; i++) {
    const resolve = page.getByRole("button", { name: /Resolver evento/ });
    if (await resolve.isVisible().catch(() => false)) {
      await resolve.click();
      await expect(resolve).toBeHidden();
      resolved = true;
      break;
    }
    await advanceTurn(page, 1);
  }
  expect(resolved, "debería aparecer un evento tras varios turnos").toBe(true);

  await expect(nextTurnButton(page)).toBeEnabled();
});

test("un evento sin resolver bloquea el siguiente turno", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");
  await startGame(page);

  let sawUnresolved = false;
  for (let i = 0; i < 12; i++) {
    if (
      await nextTurnButton(page)
        .isDisabled()
        .catch(() => false)
    ) {
      sawUnresolved = true;
      break;
    }
    await advanceTurn(page, 1);
  }
  expect(
    sawUnresolved,
    "debería existir un turno con evento sin resolver",
  ).toBe(true);
  await expect(nextTurnButton(page)).toBeDisabled();

  await page.getByRole("button", { name: /Resolver evento/ }).click();
  await expect(nextTurnButton(page)).toBeEnabled();
});
