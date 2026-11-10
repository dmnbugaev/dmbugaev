import type { Metadata } from "next";
import "./globals.css";

/*
 * Корневой layout (Server Component).
 *
 * ВАЖНО: перед реализацией дизайна изучи docs/DESIGN_REFERENCE.md —
 * метаданные (title/description) и шрифты будут обновлены по референсу.
 * Шрифты подключаются через next/font в этом файле (не через <link>).
 */

export const metadata: Metadata = {
  title: {
    default: "Dmbugaev — Portfolio",
    template: "%s — Dmbugaev",
  },
  description: "Персональное портфолио разработчика",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
