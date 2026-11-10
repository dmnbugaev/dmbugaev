import { test, expect } from "@playwright/test";

/**
 * E2E smoke-тест: приложение запускается и отвечает.
 * Конфигурация проектов (desktop / desktop-wide / tablet / mobile)
 * задаётся в playwright.config.ts — тест выполнится на каждой вьюпорте.
 */
test.describe("smoke", () => {
  test("главная страница открывается", async ({ page }, testInfo) => {
    await page.goto("/");

    await expect(page.locator("main")).toBeVisible();

    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);

    // Демонстрация скриншот-инфраструктуры: файл сохраняется в test-results.
    // Полноценные визуальные исследования выполняются через Playwright MCP
    // и Chrome DevTools MCP (см. docs/SETUP_REPORT.md).
    await page.screenshot({
      path: testInfo.outputPath("home-full.png"),
      fullPage: true,
    });
  });
});
