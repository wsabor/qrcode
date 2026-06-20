import type { HistoryItem } from "../types";

const HISTORY_KEY = "qr-code-history";

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}
