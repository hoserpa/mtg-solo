import { test, expect } from "@playwright/test";
import {
  goToSetup,
  startGame,
  selectDifficulty,
  advanceTurn,
  nextTurnButton,
  resolveFirstEvent,
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

  await resolveFirstEvent(page);

  await expect(nextTurnButton(page)).toBeEnabled();
});

test("muestra el historial tras resolver un evento", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");
  await startGame(page);

  // Fácil no genera eventos: el botón de historial no debe existir todavía.
  await expect(page.getByLabel("Ver historial")).toHaveCount(0);

  await resolveFirstEvent(page);

  await page.getByLabel("Ver historial").click();
  const dialog = page.getByRole("dialog", { name: "Historial de eventos" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Historial")).toBeVisible();

  await page.getByLabel("Cerrar historial").click();
  await expect(dialog).toBeHidden();
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
