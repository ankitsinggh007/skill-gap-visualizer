import apiUrl from "./apiClient";

let lastWarmup = 0;
const WARMUP_INTERVAL_MS = 2 * 60 * 1000;

export function warmupHealth({ force = false } = {}) {
  const now = Date.now();
  if (!force && lastWarmup && now - lastWarmup < WARMUP_INTERVAL_MS) return;
  lastWarmup = now;

  fetch(apiUrl("/api/health")).catch(() => {
    // Warm-up failures should never block the user flow.
  });
}
