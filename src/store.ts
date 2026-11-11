import { useSyncExternalStore } from 'react';

export type Rec = { best: number; last: number; n: number; t: number };
type State = { scores: Record<string, Rec>; grid: boolean };

const KEY = 'canon.workbook.v1';
export const MASTERY = 80;

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { scores: {}, grid: false, ...JSON.parse(raw) };
  } catch {}
  return { scores: {}, grid: false };
}

let state = load();
const subs = new Set<() => void>();

function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  subs.forEach((f) => f());
}

export function useStore(): State {
  return useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => state,
  );
}

export function record(id: string, score: number) {
  const prev = state.scores[id];
  const rec: Rec = {
    best: Math.max(prev?.best ?? 0, score),
    last: score,
    n: (prev?.n ?? 0) + 1,
    t: Date.now(),
  };
  set({ ...state, scores: { ...state.scores, [id]: rec } });
}

export function toggleGrid() {
  set({ ...state, grid: !state.grid });
}

export function resetAll() {
  set({ scores: {}, grid: state.grid });
}

/* Review queue: lives for the session only. */
let queue: string[] = [];
export function setQueue(ids: string[]) {
  queue = ids;
}
export function getQueue() {
  return queue;
}

/* The weakest and the longest unseen come first. */
export function pickReview(ids: string[], n = 5): string[] {
  const now = Date.now();
  const seen = ids.filter((id) => state.scores[id]);
  const pool = seen.length >= n ? seen : ids;
  return [...pool]
    .sort((a, b) => weight(b) - weight(a))
    .slice(0, n);

  function weight(id: string) {
    const r = state.scores[id];
    if (!r) return 50;
    const days = (now - r.t) / 864e5;
    return 100 - r.last + Math.min(days, 30) * 2;
  }
}
