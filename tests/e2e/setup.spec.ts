import { test, expect } from "@playwright/test";
import { goToSetup, startGame, selectDifficulty, spinbutton } from "./helpers";

test("abre la aplicación y muestra el inicio", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "MTG Practice" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Nueva Partida" }),
  ).toBeVisible();
});

test("navega del inicio a la configuración y vuelve", async ({ page }) => {
  await goToSetup(page);
  await page.getByRole("button", { name: "Volver" }).click();
  await expect(
    page.getByRole("button", { name: "Nueva Partida" }),
  ).toBeVisible();
});

test("crea una partida Fácil", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Fácil");
  await startGame(page);
  await expect(
    page.getByRole("button", { name: "Siguiente Turno" }),
  ).toBeEnabled();
});

test("crea una partida Medio", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Medio");
  await startGame(page);
  await expect(page.getByText(/Ronda 1/)).toBeVisible();
});

test("crea una partida Difícil", async ({ page }) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");
  await startGame(page);
  await expect(
    page.getByRole("button", { name: "Siguiente Turno" }),
  ).toBeEnabled();
});

test("crea una partida personalizada con vida y rondas ajustadas", async ({
  page,
}) => {
  await goToSetup(page);
  await selectDifficulty(page, "Difícil");

  await page.getByLabel("Reducir Vida del Jugador").click();
  await expect(spinbutton(page, "Vida del Jugador")).toHaveValue("19");

  await page.getByLabel("Reducir Rondas Máximas").click();
  await expect(spinbutton(page, "Rondas Máximas")).toHaveValue("15");

  await startGame(page);
  await expect(
    page.getByRole("button", { name: "Siguiente Turno" }),
  ).toBeEnabled();
});
