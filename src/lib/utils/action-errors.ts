export const DEFAULT_ACTION_ERROR = 'Service temporarily unavailable. Please try again.';

/**
 * Normalizes an unknown catch value to a user-facing error string.
 * Always returns the fallback — never exposes internal error details.
 */
export function toUserError(_err: unknown, fallback = DEFAULT_ACTION_ERROR): string {
  return fallback;
}
