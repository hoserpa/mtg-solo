import { test, expect } from "@playwright/test";
import {
  startGame,
  selectDifficulty,
  resolveFirstEvent,
  resultTitle,
  cpuLifeLabel,
} from "./helpers";

test("recorrido completo: abrir, configurar, jugar, ganar y reiniciar", async ({
  page,
}) => {
  // Home
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Nueva Partida" }),
  ).toBeVisible();

  // Elegir dificultad y empezar
  await page.getByRole("button", { name: "Nueva Partida" }).click();
  await selectDifficulty(page, "Difícil");
  await startGame(page);
  await expect(page.getByText(/Ronda 1/)).toBeVisible();

  // Recibir y resolver un evento
  await resolveFirstEvent(page);
  await expect(page.getByLabel("Ver historial")).toBeVisible();

  // Jugar una partida completa: reducir la vida del rival a 0
  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Rival -5" }).click();
  }
  await expect(resultTitle(page, "Victoria")).toBeVisible();

  // Reiniciar
  await page.getByRole("button", { name: "Jugar de Nuevo" }).click();
  await expect(
    page.getByRole("button", { name: "Siguiente Turno" }),
  ).toBeVisible();
});

test("recorrido de derrota y reinicio a configuración", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Nueva Partida" }).click();
  await selectDifficulty(page, "Medio");
  await startGame(page);

  await expect(cpuLifeLabel(page)).toHaveText("20");
  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Jugador -5" }).click();
  }
  await expect(resultTitle(page, "Derrota")).toBeVisible();

  await page.getByRole("button", { name: "Cambiar Configuración" }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva Partida" }),
  ).toBeVisible();
});
