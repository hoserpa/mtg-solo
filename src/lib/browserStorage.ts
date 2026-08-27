import type { StorageLike } from "@/features/settings/settingsStore";

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string): void {
      store.set(key, value);
    },
    removeItem(key: string): void {
      store.delete(key);
    },
  };
}

export function getBrowserStorage(): StorageLike {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const testKey = "__mtg_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return {
        getItem: (key) => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value),
        removeItem: (key) => window.localStorage.removeItem(key),
      };
    } catch {
      // localStorage no disponible (modo privado, bloqueado) → memoria.
    }
  }
  return createMemoryStorage();
}
