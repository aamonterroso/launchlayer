// A simple utility to create a delay, used in demo auth actions to simulate network latency.
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
