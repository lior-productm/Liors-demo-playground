const MIGRATED_FLAG_PREFIX = "amiio:migrated:";

export function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — ignore */
  }
}

/** One-time copy from sessionStorage → localStorage so data survives tab close. */
export function migrateSessionStorageToLocal(sessionKey: string, localKey = sessionKey) {
  if (typeof window === "undefined") return;
  const flag = `${MIGRATED_FLAG_PREFIX}${localKey}`;
  if (localStorage.getItem(flag)) return;

  const fromSession = sessionStorage.getItem(sessionKey);
  const existingLocal = localStorage.getItem(localKey);

  if (fromSession && !existingLocal) {
    localStorage.setItem(localKey, fromSession);
  }

  if (fromSession || existingLocal) {
    localStorage.setItem(flag, "1");
    sessionStorage.removeItem(sessionKey);
  }
}
