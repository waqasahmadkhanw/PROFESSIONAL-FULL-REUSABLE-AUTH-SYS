const isBrowser = typeof window !== "undefined";
const STORAGE_PREFIX = "mern-app:";

const namespacedKey = (key: string) => `${STORAGE_PREFIX}${key}`;

export const storage = {
  get<T>(key: string): T | null {
    if (!isBrowser) return null;

    try {
      const item = localStorage.getItem(namespacedKey(key));
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;

    try {
      localStorage.setItem(namespacedKey(key), JSON.stringify(value));
    } catch {
      // Storage may be unavailable or full; callers should remain functional.
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(namespacedKey(key));
    } catch {
      // Ignore storage access failures.
    }
  },

  clear(): void {
    if (!isBrowser) return;

    try {
      for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const key = localStorage.key(index);
        if (key?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage access failures.
    }
  },
};
