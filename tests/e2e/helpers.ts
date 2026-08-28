import { expect, type Page } from "@playwright/test";

export async function goToSetup(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByRole("button", { name: "Nueva Partida" }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva Partida" }),
  ).toBeVisible();
}

export async function selectDifficulty(
  page: Page,
  name: string,
): Promise<void> {
  await page.getByRole("button", { name: new RegExp(name) }).click();
}

export async function startGame(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Comenzar" }).click();
  await expect(
    page.getByRole("button", { name: "Siguiente Turno" }),
  ).toBeVisible();
}

export const nextTurnButton = (page: Page) =>
  page.getByRole("button", { name: "Siguiente Turno" });

export async function advanceTurn(page: Page, times = 1): Promise<void> {
  for (let i = 0; i < times; i++) {
    await nextTurnButton(page).click();
  }
}

export async function resolveFirstEvent(
  page: Page,
  maxTurns = 12,
): Promise<void> {
  let resolved = false;
  for (let i = 0; i < maxTurns; i++) {
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
}

export async function resolveFlow(page: Page): Promise<void> {
  const resolve = page.getByRole("button", { name: /Resolver evento/ });
  await expect(resolve).toBeVisible();
  await resolve.click();
  await expect(resolve).toBeHidden();
}

export const cpuLifeLabel = (page: Page) => page.getByLabel("Vida del rival");
export const playerLifeLabel = (page: Page) =>
  page.getByLabel("Vida del jugador");

export const resultTitle = (page: Page, name: string) =>
  page.getByText(name, { exact: true });

export const spinbutton = (page: Page, label: string) =>
  page.getByRole("spinbutton", { name: label });
