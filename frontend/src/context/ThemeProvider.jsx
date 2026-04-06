import { useEffect, useMemo, useState } from "react";
import ThemeContext from "./themeContext.js";

const STORAGE_KEY = "theme-mode";
const VALID_MODES = new Set(["system", "light", "dark"]);

const getInitialMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_MODES.has(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    if (media.addEventListener) media.addEventListener("change", onChange);
    else media.addListener(onChange);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onChange);
      else media.removeListener(onChange);
    };
  }, []);

  const resolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage errors
    }
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.themeMode = mode;
    root.style.colorScheme = resolvedTheme;
  }, [mode, resolvedTheme]);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
