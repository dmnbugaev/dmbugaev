# Setup Report — настройка окружения проекта

> Дата: 2026-11-11 · Ветка: `chore/project-bootstrap` → `main`
> Этап: **bootstrap инфраструктуры**. Дизайн портфолио НЕ начинался.

## Что было обнаружено изначально

Директория `/Users/dmitriy/Projects/dmbugaev` была **полностью пустой**:

- файлов проекта не было (в т.ч. `package.json`);
- Git не был инициализирован;
- проект Next.js отсутствовал;
- локальных MCP/Skills-конфигураций проекта не было.

**Окружение машины:**

| Компонент | Версия | Примечание |
|---|---|---|
| Node.js | 24.21.0 (nvm) | соответствует требованиям Next.js 16 |
| npm | 11.19.0 | pnpm/yarn/bun не установлены → используется npm |
| Git | 2.50.1 | без глобального credential helper |
| GitHub CLI (`gh`) | авторизован как `dmnbugaev` | scopes: `gist`, `read:org`, `repo` |

**Удалённый репозиторий** `https://github.com/dmnbugaev/dmbugaev.git` — существовал,
но был **пустым** (ни одной ссылки). История не уничтожалась — синхронизация не требовалась.

**MCP, настроенные на уровне пользователя до начала работы** (вне репозитория):

- `node_repl` — встроенная браузерная автоматизация ZCode (plugin browser-use);
- `githubcopilot` — HTTP MCP для GitHub (issues/PR/branches);
- `figma` — локальный Figma MCP (`127.0.0.1:3845`; доступен только когда запущен Figma-десктоп).

## Что было настроено

1. Git-репозиторий с веткой `main` и remote `origin` (HTTPS-URL из задания).
2. Next.js-проект создан `create-next-app@latest` в текущей директории (без вложенной папки),
   флаги: `--ts --tailwind --eslint --app --src-dir --import-alias "@/*" --empty`.
3. Полная инфраструктура качества: ESLint + Prettier, TypeScript strict, Vitest, Playwright.
4. Design tokens-основа и анимационный стек.
5. Workspace-конфигурация ZCode: MCP + Skills.
6. Документация для людей и AI-агентов.

## Next.js

- **Версия:** 16.4.6 (актуальный стабильный), Turbopack — bundler по умолчанию.
- **React:** 19.3.0 (современная React-модель, Server Components по умолчанию).
- **App Router**, `src/`-директория, алиас `@/*` → `./src/*`.
- Включённые возможности Next 16: `cacheComponents: true`, `partialPrefetching: true` (из каркаса CNA).
- `next.config.ts` — минимальный, без переопределения каркаса.
- ВАЖНО (для агентов): блок `nextjs-agent-rules` в `AGENTS.md` ведёт к встроенным докам
  Next (`node_modules/next/dist/docs/`) — API Next 16 могут отличаться от известных моделей.

## TypeScript

- `strict: true` (из каркаса, не отключался и не будет).
- `@types/node` поднят с `^20` до `^24` — требование peer-зависимости vitest 5 и соответствие
  runtime Node 24.
- Скрипт проверки: `npm run typecheck` (`tsc --noEmit`) — проходит.
- Конфиг tsconfig не расширялся сверх каркаса: правило «не отключать проверки» соблюдено,
  ужесточения — по мере надобности, осознанно.

## Styling

- **Tailwind CSS 4.3.3** (CSS-first, конфигурация в CSS, `tailwind.config.js` не нужен).
- Подключение через Turbopack-плагин (`@tailwindcss/turbopack`).
- **Design tokens:** `src/styles/tokens.css` — трёхуровневая структура
  (primitives → semantic → маппинг в Tailwind через `@theme inline` в `globals.css`).
  Утилиты `bg-background`, `text-foreground`, `text-muted`, `border-border` и т.д. уже работают.
  **Текущие значения — нейтральные заглушки каркаса** (светлая/тёмная тема), не дизайн-решение.
- Архитектура допускает: CSS variables, CSS Modules, глобальные стили, сложные анимации,
  responsive design — ограничений каркаса нет.
- **Анимационный стек установлен:** `motion@14` + `gsap@3` (ScrollTrigger входит в пакет).
  Выбор инструмента под конкретный эффект — `docs/ANIMATION_GUIDELINES.md`;
  финальное распределение фиксируется по референсу в `docs/DESIGN_REFERENCE.md`.

## Testing

- **Vitest 5.1.0** + **React Testing Library 16** + **jsdom** — unit/component-тесты.
  Конфиг: `vitest.config.mts` (расширение `.mts` — чтобы Vitest не ругался на ESM-синтаксис
  в CJS-контексте). Тесты: `tests/unit/`. Smoke: 3 теста хелпера `cn` — проходят.
- **Playwright 1.65** — e2e + визуальные исследования. Конфиг: `playwright.config.ts`:
  - проекты-вьюпорты: `desktop` (1440×900, DPR 2), `desktop-wide` (1920×1080), `tablet` (iPad Mini), `mobile` (iPhone 13);
  - `webServer` автоматически поднимает dev-сервер (или используй `PW_BASE_URL` для внешнего);
  - скриншоты при падении, trace на падении, html-отчёт в CI;
  - готовность к visual regression: `toHaveScreenshot`, базовые скриншоты — `tests/screenshots/`.
  - Chromium установлен локально (`npx playwright install chromium` — выполнено).
  - Smoke: 4 проекта × 1 тест — проходят (8.7s).
- Написаны только smoke-тесты — наполнение на следующих этапах.

## MCP

Подключены на уровне **workspace** (`.zcode/config.json`, коммитится в репозиторий;
ZCode доверяет workspace-серверам и подключает автоматически при открытии проекта).
Все три сервера проверены handshake-тестом (initialize → корректный JSON-RPC ответ).

### playwright (`@playwright/mcp@0.0.85`, официальная Microsoft)

- **Назначение:** браузерная автоматизация — навигация, клики/ввод, скриншоты (в т.ч. full-page),
  управление вьюпортами, вкладки, изучение responsive behavior.
- **Как используется:** визуальное исследование референсных сайтов и проверка собственного сайта.
  Основной инструмент этапа design research (Skill `design-reference-research`).

### chrome-devtools (`chrome-devtools-mcp@1.12.0`, официальная Google Chrome DevTools team)

- **Назначение:** DOM-инспекция, computed styles, layout и размеры элементов, CSS,
  performance-трейсы, network, console, скриншоты.
- **Как используется:** извлечение точных значений дизайна (шрифты, цвета, отступы) из
  референса; аудит производительности анимаций; отладка собственного сайта.

### context7 (`@upstash/context7-mcp@4.6.0`, официальная Upstash)

- **Назначение:** актуальная документация библиотек (Next.js, React, TypeScript, Tailwind,
  Motion, GSAP, Playwright).
- **Как используется:** вызов `resolve-library-id`, затем `get-library-docs` — перед
  использованием API, версии которых могли измениться. Опционально поднимает лимиты ключ
  `CONTEXT7_API_KEY` (не является секретом репозитория, задаётся в user-конфигурации при необходимости).

### GitHub MCP

- Отдельный сервер не подключался: на уровне пользователя уже есть **`githubcopilot`**
  (HTTP MCP GitHub). Задачи repo/branches/PR закрываются им + `gh` CLI (авторизован).

### Filesystem MCP

- Не подключался: ZCode имеет нативные файловые инструменты; дублирование не нужно.

## Skills

Установлены на уровень **проекта** (`.agents/skills/`, коммитятся; реестр — `skills-lock.json`).
Выборка из открытого каталога skills.sh, приоритет — официальные источники и большое число установок:

| Skill | Источник | Назначение |
|---|---|---|
| `design-reference-research` | **кастомный (авторский)** | методика глубокого исследования референса: Playwright MCP + Chrome DevTools MCP → заполнение `docs/DESIGN_REFERENCE.md` |
| `frontend-design` | anthropics/skills (офиц.) | качество и намеренность визуальных решений |
| `web-design-guidelines` | vercel-labs (845K+ установок) | чек-листы реализации UI |
| `vercel-react-best-practices` | vercel-labs (887K+) | паттерны и производительность React |
| `tailwind-4-docs` | lombiq | актуальная работа с Tailwind v4 |
| `gsap-core` | greensock (офиц.) | база GSAP |
| `gsap-scrolltrigger` | greensock (офиц.) | скролл-сцены, pin, scrub |
| `gsap-react` | greensock (офиц.) | GSAP в React корректно |
| `animation-vocabulary` | emilkowalski | язык анимаций (easing, duration, stagger) |
| `playwright-cli` | microsoft (офиц.) | браузерная автоматизация через Playwright CLI |
| `playwright-best-practices` | currents-dev (105K+) | лучшие практики e2e/visual regression |
| `chrome-devtools` | chromedevtools (офиц.) | работа через DevTools MCP |
| `accessibility` | addyosmani/web-quality-skills | WCAG-практики |
| `performance` | addyosmani/web-quality-skills | оптимизация производительности |
| `core-web-vitals` | addyosmani/web-quality-skills | CWV-метрики |
| `seo` | addyosmani/web-quality-skills | SEO-основы |
| `vitest` | antfu/skills | паттерны Vitest |

Итого 17. Дублирующих и «случайных» skills не устанавливалось.

## Git

- **Repository:** `https://github.com/dmnbugaev/dmbugaev.git` (origin, HTTPS).
- **Ветка bootstrap:** `chore/project-bootstrap` — вся настройка закоммичена здесь.
- **Ветка разработки:** `main` — выставлена на тот же коммит (fast-forward, без force push).
- **Commit:** `chore: bootstrap portfolio development environment`.
- **Push:** обе ветки отправлены на origin (push безопасен: remote был пуст; авторизация `gh` подтверждена).
- **Identity:** локально для репозитория задан `dmnbugaev` + GitHub noreply-email
  (глобальный git-identity на машине не сконфигурирован — не изменялся).
- **Секреты:** в Git не попадают. `.env*` игнорируется, исключение — `.env.example` (шаблон).
  Токенов/API-ключей в коде нет; MCP-серверы не требуют секретов для базовой работы.

## Команды проекта

```bash
npm install            # установка зависимостей
npm run dev            # dev-сервер (Turbopack) → http://localhost:3000
npm run build          # production-сборка
npm run start          # запуск production-сборки
npm run lint           # ESLint
npm run typecheck      # TypeScript (tsc --noEmit)
npm run format         # Prettier: форматирование
npm run format:check   # Prettier: проверка
npm test               # Vitest (single run)
npm run test:watch     # Vitest (watch)
npm run test:e2e       # Playwright (4 вьюпорта, сервер поднимается сам)
npm run test:e2e:ui    # Playwright UI-режим
npx playwright install chromium   # (уже выполнено) браузер для Playwright
```

**Результат верификации (все на чистой установке):** `lint` ✓ · `typecheck` ✓ ·
`test` ✓ (3/3) · `build` ✓ (статические маршруты `/` и `/_not-found`) ·
`test:e2e` ✓ (4/4) · `format:check` ✓ · запуск dev-сервера ✓ (через webServer Playwright).

## Что должен знать следующий AI-агент

1. **Прочитай `AGENTS.md` полностью** — это обязательные правила работы с проектом.
2. **Дизайн не начат.** Текущая страница — заглушка для проверки инфраструктуры.
   Первая задача этапа дизайна — исследование референса (Skill `design-reference-research`)
   и заполнение `docs/DESIGN_REFERENCE.md`. Вёрстка — только после этого.
3. **Design tokens:** все цвета/шрифты/длительности — через `src/styles/tokens.css`;
   hex в Tailwind-классах запрещён.
4. **Server Components по умолчанию**, `"use client"` — только для реальной интерактивности.
5. **Анимации:** Motion для UI-состояний, GSAP+ScrollTrigger для скролл-сцен
   (детали и чек-лист — `docs/ANIMATION_GUIDELINES.md`).
6. **MCP `playwright` и `chrome-devtools`** подключаются автоматически при открытии проекта
   (workspace scope, `.zcode/config.json`). В этой сессии-настройщике они проверены handshake'ом;
   в новой сессии они появятся в списке инструментов. Если сервер не подключился —
   Settings → MCP (см. Skill `diagnosing-mcp`).
7. **Skills** проекта — в `.agents/skills/`; при добавлении новых — через
   `npx skills add <owner/repo@skill>` (обновляется `skills-lock.json`).
8. **Git:** работа в ветках `feat/*`, `fix/*`, `chore/*`; conventional commits;
   merge в `main`; без force push.
9. **Перед merge:** `lint` + `typecheck` + `test` + `build` — всё зелёное.
10. Встроенные доки Next.js 16: `node_modules/next/dist/docs/` — API могли измениться
    относительно обучающих данных (см. блок nextjs-agent-rules в `AGENTS.md`).

## Возможные ограничения

1. **npm-установка однажды упала по сети** (`EIDLETIMEOUT` к registry.npmjs.org) — решилось
   повтором. При медленной сети установка может занять несколько минут.
2. **`chrome-devtools` MCP** запускает системный Chrome — Figma-совместимость не требовалась,
   но на машинах без установленного Chrome сервер не сможет открыть браузер
   (Playwright MCP умеет работать и с bundled-браузером).
3. **Context7 без API-ключа** работает с лимитами; для интенсивной работы с доками
   задай `CONTEXT7_API_KEY` в user-конфигурации MCP.
4. **`figma` MCP** (user scope) доступен только при запущенном Figma-десктопе — на этапе
   исследования референса не требуется.
5. **Глобальный git identity** на машине не настроен — задан локально для этого репозитория.
   Другие репозитории не затронуты.
6. **CI-пайплайн** не настраивался (не входил в задание) — Playwright/Vitest готовы к CI
   (репортеры и ретраи для CI уже сконфигурированы).
7. **Пакеты MCP не включены в devDependencies** осознанно: они запускаются через `npx`
   с зафиксированными версиями — чтобы не тянуть в дерево зависимостей проекта
   их серверные транзитивные зависимости (express и пр.).
