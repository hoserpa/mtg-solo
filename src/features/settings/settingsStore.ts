import type { PersistedData, StoredSettings } from "./settingsTypes";
import { CURRENT_SETTINGS_VERSION, STORAGE_KEY } from "./settingsTypes";
import { parsePersistedData } from "./settingsValidation";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type SettingsStore = {
  load(): StoredSettings | null;
  save(settings: StoredSettings): void;
  clear(): void;
};

export function createSettingsStore(storage: StorageLike): SettingsStore {
  return {
    load(): StoredSettings | null {
      let raw: string | null;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
      if (!raw) return null;

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return null;
      }

      const data = parsePersistedData(parsed);
      return data ? data.settings : null;
    },

    save(settings: StoredSettings): void {
      const payload: PersistedData = {
        version: CURRENT_SETTINGS_VERSION,
        settings,
      };
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // storage no disponible o lleno: no rompe la aplicación.
      }
    },

    clear(): void {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // ignorar
      }
    },
  };
}
