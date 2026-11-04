/**
 * Safe LocalStorage helpers for application preferences and cache.
 * Note: Authentication is handled securely via JWT tokens in api.js.
 * Plaintext passwords and user credentials are NEVER stored here.
 */

export const readJson = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
};
