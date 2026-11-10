import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Конфигурация Vitest для unit- и component-тестов.
 *
 * - environment: jsdom — эмуляция браузера для React Testing Library
 * - setupFiles: подключение дополнительных матчеров jest-dom
 * - alias: совпадает с tsconfig (@/* -> ./src/*)
 * E2E-тесты (Playwright) живут отдельно в tests/e2e и не участвуют здесь.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
