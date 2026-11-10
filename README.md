# Dmbugaev — Personal Portfolio

Персональный сайт-портфолио разработчика. Современный стек, сложные анимации,
акцент на качество визуальной реализации и производительность.

> **Для AI-агентов:** инструкции по работе с проектом — в [AGENTS.md](./AGENTS.md).
> Перед реализацией дизайна обязательно изучи [docs/DESIGN_REFERENCE.md](./docs/DESIGN_REFERENCE.md).

## Стек

- **Next.js 16** (App Router, Turbopack, Cache Components) + **React 19**
- **TypeScript** (`strict: true`)
- **Tailwind CSS 4** (CSS-first, design tokens через CSS-переменные)
- **Motion 14** и **GSAP 3 + ScrollTrigger** — анимационный стек (выбор инструмента — по референсу)
- **Vitest** + **React Testing Library** — unit/component-тесты
- **Playwright** — E2E, скриншоты desktop/tablet/mobile, visual regression

## Требования

- Node.js ≥ 20 (проверено на 24.x)
- npm ≥ 10

## Установка и запуск

```bash
npm install          # установка зависимостей
npm run dev          # dev-сервер → http://localhost:3000
```

## Команды

| Команда                | Назначение                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Dev-сервер (Turbopack)                                                |
| `npm run build`        | Production-сборка                                                     |
| `npm run start`        | Запуск production-сборки                                              |
| `npm run lint`         | ESLint                                                                |
| `npm run typecheck`    | TypeScript (`tsc --noEmit`)                                           |
| `npm run format`       | Форматирование Prettier                                               |
| `npm run format:check` | Проверка форматирования                                               |
| `npm test`             | Unit/component-тесты (Vitest, single run)                             |
| `npm run test:watch`   | Тесты в watch-режиме                                                  |
| `npm run test:e2e`     | Playwright e2e (4 вьюпорта: desktop / desktop-wide / tablet / mobile) |
| `npm run test:e2e:ui`  | Playwright в UI-режиме                                                |

Перед каждым merge должны проходить: `lint`, `typecheck`, `test`, `build`.

## Структура проекта

```
src/
  app/          # App Router: маршруты, layout, globals.css
  components/
    ui/         # Атомарные компоненты
    layout/     # Каркасные компоненты (header, footer)
    sections/   # Секционные компоненты страниц
  hooks/        # React-хуки (client)
  lib/          # Утилиты (cn.ts)
  styles/       # Design tokens (tokens.css)
  types/        # Общие типы
docs/           # Документация (см. ниже)
tests/
  unit/         # Vitest + RTL
  e2e/          # Playwright
  screenshots/  # Базовые скриншоты visual regression
public/         # Статика
```

## Design tokens

Токены живут в [src/styles/tokens.css](./src/styles/tokens.css) и подключены к
Tailwind через `@theme inline` ([src/app/globals.css](./src/app/globals.css)) —
утилиты вида `bg-background`, `text-foreground`, `text-muted` берут значения из
CSS-переменных. Текущие значения — нейтральные заглушки каркаса; реальные
токены появляются после исследования референса и фиксируются в
[docs/DESIGN_REFERENCE.md](./docs/DESIGN_REFERENCE.md).

## Playwright и визуальные исследования

- Конфигурация: [playwright.config.ts](./playwright.config.ts) — проекты
  `desktop` (1440×900), `desktop-wide` (1920×1080), `tablet` (iPad Mini), `mobile` (iPhone 13).
- E2E-тесты: `tests/e2e/`; dev-сервер поднимается автоматически (`webServer`).
- Visual regression: `expect(page).toHaveScreenshot()`, базовые скриншоты в `tests/screenshots/`.
- Первый запуск требует браузеров: `npx playwright install chromium`.
- Интерактивное исследование сайтов-референсов — через MCP-серверы `playwright`
  и `chrome-devtools` (см. ниже) и Skill `design-reference-research`.

## Используемые MCP

Подключены на уровне проекта (`.zcode/config.json`), активируются при открытии проекта в ZCode:

| MCP                 | Назначение                                                                      |
| ------------------- | ------------------------------------------------------------------------------- |
| **playwright**      | Браузерная автоматизация: навигация, скриншоты, вьюпорты, interaction           |
| **chrome-devtools** | DOM, computed styles, layout, performance, network, console                     |
| **context7**        | Актуальная документация Next.js / React / Tailwind / GSAP / Motion / Playwright |

Дополнительно на уровне пользователя (вне репозитория): `githubcopilot` (GitHub),
`figma` (локальный Figma MCP), `node_repl` (встроенная браузерная автоматизация ZCode).

## Используемые Skills

Проектные skills в [.agents/skills/](./.agents/skills/):

- **design-reference-research** — методика исследования референсного сайта (кастомный)
- **frontend-design**, **web-design-guidelines** — качество UI-реализации
- **vercel-react-best-practices**, **vitest** — React и тестирование
- **tailwind-4-docs** — актуальная работа с Tailwind v4
- **gsap-core**, **gsap-scrolltrigger**, **gsap-react**, **animation-vocabulary** — анимации
- **playwright-cli**, **playwright-best-practices**, **chrome-devtools** — браузер и отладка
- **accessibility**, **performance**, **core-web-vitals**, **seo** — качество и метрики

## Git workflow

- Основная ветка: `main`. Функциональные ветки: `feat/*`, `fix/*`, `chore/*`.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Remote: `https://github.com/dmnbugaev/dmbugaev.git` (origin).
- Секреты — только в `.env.local` (не коммитится); шаблон — `.env.example`.

## Документация

- [AGENTS.md](./AGENTS.md) — правила для AI-агентов
- [docs/DESIGN_REFERENCE.md](./docs/DESIGN_REFERENCE.md) — источник истины по дизайну
- [docs/ANIMATION_GUIDELINES.md](./docs/ANIMATION_GUIDELINES.md) — правила анимаций
- [docs/SETUP_REPORT.md](./docs/SETUP_REPORT.md) — отчёт о настройке окружения
