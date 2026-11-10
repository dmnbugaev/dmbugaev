import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
// Отключает правила ESLint, конфликтующие с Prettier (форматирование — за Prettier).
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Артефакты тестов и сгенерированные отчёты:
    "test-results/**",
    "playwright-report/**",
    "artifacts/**",
  ]),
  prettier,
]);

export default eslintConfig;
