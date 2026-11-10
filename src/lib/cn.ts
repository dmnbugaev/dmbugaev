import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Объединяет условные классы и корректно разрешает конфликты
 * утилит Tailwind CSS (последний класс побеждает).
 *
 * Стандартный помощник для компонентов: `<div className={cn("px-4", isActive && "px-6")} />`
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
