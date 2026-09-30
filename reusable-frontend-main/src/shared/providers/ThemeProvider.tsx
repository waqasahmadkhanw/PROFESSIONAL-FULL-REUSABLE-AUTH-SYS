"use client";

/**
 * -------------------------------------------------------
 * File: shared/providers/ThemeProvider.tsx
 * Description:
 * Global theme provider using a custom implementation
 * to avoid next-themes script-tag warnings in React 19.
 * Supports Light, Dark, and System themes.
 * -------------------------------------------------------
 */

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/shared/lib/storage";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
}

interface ThemeContextValue {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  themes: string[];
  systemTheme: string | undefined;
  forcedTheme: string | undefined;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): string {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(
  storageKey: string,
  defaultTheme: string,
  enableSystem: boolean
): string {
  if (typeof window === "undefined") return defaultTheme;
  try {
    const stored = storage.get<string>(storageKey);
    if (stored) return stored;
  } catch {
    // localStorage not available
  }
  return defaultTheme;
}

function applyTheme(
  attribute: string,
  theme: string,
  themes: string[],
  enableColorScheme: boolean,
  defaultTheme: string
) {
  const root = document.documentElement;
  const validTheme = themes.includes(theme) ? theme : defaultTheme;

  if (attribute === "class") {
    root.classList.remove(...themes);
    root.classList.add(validTheme);
  } else if (attribute.startsWith("data-")) {
    if (validTheme) {
      root.setAttribute(attribute, validTheme);
    } else {
      root.removeAttribute(attribute);
    }
  }

  if (enableColorScheme) {
    root.style.colorScheme = validTheme;
  }
}

function disableTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(style);
  requestAnimationFrame(() => {
    window.getComputedStyle(document.body);
    setTimeout(() => {
      style.remove();
    }, 1);
  });
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = "theme",
  themes = ["light", "dark"],
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(() =>
    getStoredTheme(storageKey, defaultTheme, enableSystem)
  );
  const [systemTheme, setSystemTheme] = useState<string | undefined>(() =>
    enableSystem ? getSystemTheme() : undefined
  );

  const resolvedTheme = useMemo(() => {
    if (forcedTheme) return forcedTheme;
    if (theme === "system" && enableSystem) return systemTheme;
    return theme;
  }, [theme, systemTheme, enableSystem, forcedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem]);

  useEffect(() => {
    applyTheme(attribute, resolvedTheme ?? defaultTheme, themes, true, defaultTheme);
  }, [resolvedTheme, attribute, themes, defaultTheme]);

  const setThemeValue = useCallback((newTheme: string) => {
    setTheme(newTheme);
    if (disableTransitionOnChange) {
      disableTransitions();
    }
    try {
      storage.set(storageKey, newTheme);
    } catch {
      // localStorage not available
    }
  }, [disableTransitionOnChange, storageKey]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeValue,
      resolvedTheme,
      themes,
      systemTheme,
      forcedTheme,
    }),
    [theme, setThemeValue, resolvedTheme, themes, systemTheme, forcedTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
