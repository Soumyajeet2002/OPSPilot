import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./theme-context";
import type { Theme } from "./theme-context";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  const setTheme = useCallback((next: Theme): void => {
    document.documentElement.dataset.theme = next;
    updateTheme(next);
    try {
      localStorage.setItem("opspilot-theme", next);
    } catch {
      /* In-memory preference still works. */
    }
  }, []);
  useEffect(() => {
    const sync = (event: StorageEvent): void => {
      if (event.key !== "opspilot-theme" && event.key !== null) return;
      const next: Theme = event.newValue === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      updateTheme(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme, setTheme],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
