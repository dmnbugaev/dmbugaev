import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

/**
 * Smoke-тест инфраструктуры тестирования (Vitest + alias @/*).
 * Полноценные тесты компонентов добавляются на следующих этапах.
 */
describe("cn", () => {
  it("объединяет классы", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("игнорирует ложные значения", () => {
    expect(cn("px-4", false && "py-2", undefined, "")).toBe("px-4");
  });

  it("разрешает конфликты Tailwind-утилит (последний побеждает)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});
