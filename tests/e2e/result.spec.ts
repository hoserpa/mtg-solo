import { test, expect } from "@playwright/test";
import {
  goToSetup,
  startGame,
  selectDifficulty,
  resultTitle,
  cpuLifeLabel,
  playerLifeLabel,
} from "./helpers";

test("gana la partida al reducir la vida del rival a 0", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  await expect(cpuLifeLabel(page)).toHaveText("20");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Rival -5" }).click();
  }
  await expect(cpuLifeLabel(page)).toHaveText("5");

  await page.getByRole("button", { name: "Rival -5" }).click();
  await expect(resultTitle(page, "Victoria")).toBeVisible();
  await expect(page.getByText("0 vidas", { exact: true })).toBeVisible();
});

test("pierde la partida al reducir la vida del jugador a 0", async ({
  page,
}) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  await expect(playerLifeLabel(page)).toHaveText("20");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Jugador -5" }).click();
  }
  await expect(playerLifeLabel(page)).toHaveText("5");

  await page.getByRole("button", { name: "Jugador -5" }).click();
  await expect(resultTitle(page, "Derrota")).toBeVisible();
  await expect(page.getByText("0 vidas", { exact: true })).toBeVisible();
});

test("reinicia desde la pantalla de resultado", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Rival -5" }).click();
  }
  await expect(resultTitle(page, "Victoria")).toBeVisible();

  await page.getByRole("button", { name: "Jugar de Nuevo" }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva Partida" }),
  ).toBeVisible();
});

test("sale de la partida desde la partida en curso", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);

  await page.getByRole("button", { name: "Salir de la partida" }).click();
  await expect(
    page.getByRole("button", { name: "Nueva Partida" }),
  ).toBeVisible();
});
