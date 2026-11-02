export const STORAGE_KEY = 'caritas-cartagena-content-v1';

export function readSavedContent(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(fallback);
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !value.site || !Array.isArray(value.programs) || !Array.isArray(value.news)) return structuredClone(fallback);
    return value;
  } catch {
    return structuredClone(fallback);
  }
}

export function saveContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...content, version: 1 }));
}

export function clearSavedContent() {
  localStorage.removeItem(STORAGE_KEY);
}
