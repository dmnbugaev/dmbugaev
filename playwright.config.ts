import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

/**
 * Конфигурация Playwright.
 *
 * Назначения:
 *  1. E2E smoke-тесты приложения (tests/e2e).
 *  2. Основа для визуального исследования референсных сайтов:
 *     скриншоты desktop / tablet / mobile, full-page, отдельных элементов,
 *     проверка responsive behavior.
 *  3. Основа для visual regression (toHaveScreenshot / snapshot diffing).
 *
 * Важно: для интерактивного исследования сайтов внутри ZCode
 * используй также MCP-серверы `playwright` и `chrome-devtools`
 * (см. .zcode/config.json и docs/SETUP_REPORT.md).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  /* Запускаем параллельно в независимых браузерах */
  fullyParallel: true,
  /* Не роняем сборку из-за одного flaky-теста в CI, но учитываем ретраи */
  retries: process.env.CI ? 2 : 0,
  /* Отчёты: html-отчёт локально, список в CI */
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://localhost:3000",
    /* Скриншоты сохраняются при падении теста */
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    locale: "en-US",
  },

  /* Матрица вьюпортов для responsive-исследования и скриншотов */
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: "desktop-wide",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Mini"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],

  /* Автоматически поднимаем dev-сервер для локальных запусков.
     Для прод-проверок: `npm run build && npm run start`, затем
     `PW_BASE_URL=http://localhost:3000 npx playwright test` */
  webServer: process.env.PW_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        cwd: path.resolve(__dirname, "./"),
      },
});
