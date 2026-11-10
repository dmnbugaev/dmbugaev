<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — инструкции для AI-агентов

Проект: **персональный сайт-портфолио разработчика** (Dmbugaev).
Все инструкции в этом файле обязательны к соблюдению любым AI-агентом, работающим с репозиторием.

---

## ⚠️ Главное правило

**Перед реализацией любого элемента дизайна агент ОБЯЗАН изучить файл
`docs/DESIGN_REFERENCE.md`.** Этот файл — единственный источник истины по дизайну
(цвета, типографика, сетка, анимации, поведение). Если файла нет или он пуст —
сначала выполняется этап исследования референса (см. Skill `design-reference-research`),
и только потом начинается вёрстка. **Не придумывай дизайн самостоятельно.**

## Стек

| Технология           | Версия              | Назначение                                                |
| -------------------- | ------------------- | --------------------------------------------------------- |
| Next.js              | 16.x                | Фреймворк (App Router, Turbopack, Cache Components)       |
| React                | 19.x                | Современная React-модель (Server Components по умолчанию) |
| TypeScript           | 5.x, `strict: true` | Типизация без исключений                                  |
| Tailwind CSS         | 4.x (CSS-first)     | Стилизация через design tokens                            |
| Motion               | 14.x                | Декларативные анимации (UI-состояния, presence, layout)   |
| GSAP + ScrollTrigger | 3.x                 | Скролл-сцены, pin, scrub, параллакс                       |
| Vitest + RTL         | 5.x / latest        | Unit и component-тесты                                    |
| Playwright           | 1.6x                | E2E, скриншоты, visual regression                         |

Точная версия в `package.json`. Обновления — осознанно, через `npm outdated` + `npm update`.

## Архитектура

```
src/
  app/          # App Router: маршруты, layout, globals.css
  components/
    ui/         # Атомарные компоненты (кнопки, бейджи)
    layout/     # Каркасные компоненты (header, footer, контейнеры)
    sections/   # Секциональные компоненты страниц
  hooks/        # Переиспользуемые React-хуки (client)
  lib/          # Утилиты без React (cn.ts и др.)
  styles/       # tokens.css (design tokens), дополнительные стили
  types/        # Общие типы
docs/           # Документация (DESIGN_REFERENCE.md — источник истины по дизайну)
tests/
  unit/         # Vitest + React Testing Library
  e2e/          # Playwright
  screenshots/  # Базовые скриншоты visual regression
public/         # Статические ассеты
```

- Папки создаются, когда появляется реальное содержимое; не плодить пустые файлы.
- Импорты внутри `src/` — только через алиас `@/*`.

## Правила TypeScript

- `strict: true` не отключать; не добавлять `@ts-ignore` / `any` без веской причины (комментарий обязателен).
- Типы данных — `type`, объектные контракты компонентов — явные пропсы-интерфейсы.
- Экспортируемые функции/компоненты типизируются явно; вывод типов — для локальных переменных.
- Проверка перед коммитом: `npm run typecheck`.

## Правила React

- **Server Components по умолчанию.** `"use client"` — только когда нужны интерактивность, браузерные API, хуки анимации (Motion), эффекты.
- Клиентские компоненты — максимально «листовые»: данные и разметку готовят серверные обёртки.
- Никаких `useEffect` для задач, решаемых на сервере или через кеш.
- Списки — стабильные `key`; обработчики — стабильные ссылки там, где это важно для анимаций.

## Правила Next.js

- App Router; новые маршруты — `src/app/<route>/page.tsx` + `metadata`.
- В этом проекте включён `cacheComponents` (Next 16): асинхронные запросы — через `use cache` / `Suspense`-границы, читай встроенные доки Next (`node_modules/next/dist/docs/`).
- Шрифты — только `next/font` в корневом layout (не `<link>`).
- Изображения — только `next/image` (или `<picture>` для особых эффектов).
- Метаданные — через `metadata` / `generateMetadata`, canonical URL из `NEXT_PUBLIC_SITE_URL`.

## Правила Tailwind

- Tailwind v4 — CSS-first: конфигурация через CSS (`@theme`), не через `tailwind.config.js`.
- **Цвета, шрифты, радиусы, durations — только из токенов** (`src/styles/tokens.css` → утилиты `bg-background`, `text-foreground` и т.д.). Hex в классах запрещён.
- Порядок классов — Prettier-плагин (`prettier-plugin-tailwindcss`) отсортирует; не сортировать вручную.
- Сложные/переиспользуемые стили — CSS Modules рядом с компонентом при необходимости.
- Уникальные сложные эффекты допустимо оформлять обычным CSS в tokens.css/глобальном файле, если Tailwind-классы неэффективны.

## Responsive design

- Mobile-first: базовые стили для мобильных, расширение через `sm/md/lg/xl`.
- Контрольные вьюпорты: **1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile)** — совпадают с проектами Playwright.
- Тексты и сетки не должны ломаться между брейкпойнтами; никаких горизонтальных скроллов.
- Тач-цели ≥ 44×44px на мобильных.

## Accessibility (WCAG 2.1 AA)

- Семантическая разметка: `header/nav/main/section/footer`, один `h1` на страницу, логичная иерархия заголовков.
- Интерактив — только доступные элементы (`a`, `button`), фокус видимый, `:focus-visible` не отключать.
- Контраст текста ≥ 4.5:1 (проверять токены в tokens.css).
- Анимации уважают `prefers-reduced-motion` (базовый CSS уже настроен в globals.css).
- Картинки — осмысленный `alt`; декоративные — `alt=""`.

## Производительность

- Target: Core Web Vitals в «зелёной зоне» (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Анимировать только `transform` и `opacity` (+ `clip-path` при необходимости); избегать animating `layout`-свойств.
- Шрифты — `next/font` (авто-subset, preload); изображения — `next/image` с корректными `sizes`.
- Клиентские бандлы держать лёгкими: тяжёлые библиотеки анимаций — динамический импорт (`next/dynamic`), GSAP-плагины регистрировать локально.
- Проверки: `npm run build` (бюджеты бандла) и Lighthouse/DevTools MCP перед крупными merge.

## Анимации

Полные правила — в `docs/ANIMATION_GUIDELINES.md`. Кратко:

- Два инструмента: **Motion** (декларативные UI-анимации) и **GSAP + ScrollTrigger** (скролл-сцены, pin, scrub, параллакс). Финальный выбор по типам эффектов — после исследования референса.
- Все анимации — transform/opacity, respect `prefers-reduced-motion`, без `layout thrashing`.
- GSAP в React: регистрация плагинов — только в client-коде, `gsap.context()`/`useGSAP`-подход для очистки.

## Git

- Ветка разработки: `main`; промежуточные ветки — `feat/*`, `fix/*`, `chore/*`.
- Conventional Commits на английском: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Коммит — маленький и осмысленный; push без force.
- Секреты в Git не попадают: переменные — в `.env.local` (есть `.env.example`).

## Тестирование

- Unit/component: `npm test` (Vitest + RTL), тесты в `tests/unit`.
- E2E smoke: `npm run test:e2e` (Playwright), тесты в `tests/e2e`, сервер поднимается автоматически.
- Visual regression: `expect(page).toHaveScreenshot()` — базовые скриншоты в `tests/screenshots` (обновление осознанно: `--update-snapshots`).
- Перед merge: lint + typecheck + test + build должны проходить.

## Доступные инструменты AI (MCP и Skills)

### MCP (подключаются автоматически, конфиг `.zcode/config.json`)

| Сервер                       | Назначение                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `playwright`                 | Браузерная автоматизация: навигация, клики, скриншоты, вьюпорты, изучение responsive behavior                          |
| `chrome-devtools`            | DOM/computed styles, layout, performance, network, console, размеры элементов                                          |
| `context7`                   | Актуальная документация Next.js, React, Tailwind, GSAP, Motion, Playwright (`resolve-library-id` → `get-library-docs`) |
| `githubcopilot` (user scope) | Работа с GitHub-репозиторием: issues, PR, branches                                                                     |
| `node_repl` (user scope)     | Встроенная браузерная автоматизация ZCode (plugin browser-use)                                                         |

### Skills (`.agents/skills/`, 17 шт.)

`design-reference-research` (кастомный, главный для следующего этапа), `frontend-design`,
`vercel-react-best-practices`, `web-design-guidelines`, `tailwind-4-docs`,
`gsap-core`, `gsap-scrolltrigger`, `gsap-react`, `animation-vocabulary`,
`playwright-cli`, `playwright-best-practices`, `chrome-devtools`,
`accessibility`, `performance`, `core-web-vitals`, `seo`, `vitest`.

## Структура документации

- `docs/DESIGN_REFERENCE.md` — источник истины по дизайну (заполняется на этапе исследования).
- `docs/ANIMATION_GUIDELINES.md` — правила анимаций и выбор между Motion/GSAP.
- `docs/SETUP_REPORT.md` — отчёт о настройке окружения (что, как, почему).
- `README.md` — запуск и команды для человека.
