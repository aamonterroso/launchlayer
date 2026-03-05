// Controlled failure + latency simulation for server actions.
// Completely inert unless ENABLE_FAILURE_SIMULATION=true.
// Never throws due to malformed env values.

const ENABLED = process.env.ENABLE_FAILURE_SIMULATION === 'true';

const DEFAULT_FAILURE_RATE = 0.3;
const DEFAULT_LATENCY_MIN = 200;
const DEFAULT_LATENCY_MAX = 800;

function parseRate(raw: string | undefined): number {
  const n = parseFloat(raw ?? '');
  if (isNaN(n)) return DEFAULT_FAILURE_RATE;
  return Math.min(1, Math.max(0, n));
}

function parseLatency(raw: string | undefined, fallback: number): number {
  const n = parseInt(raw ?? '', 10);
  return isNaN(n) ? fallback : Math.max(0, n);
}

const FAILURE_RATE = parseRate(process.env.FAILURE_RATE);
const LATENCY_MIN = parseLatency(process.env.LATENCY_MIN_MS, DEFAULT_LATENCY_MIN);
const LATENCY_MAX = Math.max(
  LATENCY_MIN,
  parseLatency(process.env.LATENCY_MAX_MS, DEFAULT_LATENCY_MAX),
);

/**
 * Dev-only helper that injects latency and random failures.
 * Place before the mutation in server actions.
 */
export async function simulateOperation(operationName = 'operation'): Promise<void> {
  if (!ENABLED) return;

  const delay = LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN);
  await new Promise<void>((resolve) => setTimeout(resolve, delay));

  if (Math.random() < FAILURE_RATE) {
    console.warn(`[failure-simulation] ${operationName} failed`);
    throw new Error('[failure-simulation] simulated failure');
  }
}
