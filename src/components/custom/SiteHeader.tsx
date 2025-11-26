"use client";

import { ThemeSwitcher } from "@/providers/ThemeProvider";

export function SiteHeader() {
  return (
    <header className="fixed bottom-4 left-4 z-50">
      <ThemeSwitcher />
    </header>
  );
}
