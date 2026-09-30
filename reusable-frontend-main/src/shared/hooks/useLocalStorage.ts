"use client";

import { useEffect, useState } from "react";
import { storage } from "@/shared/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => storage.get<T>(key) ?? initialValue);

  useEffect(() => {
    storage.set(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
