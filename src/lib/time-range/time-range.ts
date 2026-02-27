import 'server-only';

// ---------- Types ----------

export type TimeRangePreset = '7d' | '30d' | '90d';

/** Shape of Next.js App Router searchParams. */
export type SearchParams = Record<string, string | string[] | undefined>;

export type TimeRange = {
  kind: 'preset';
  preset: TimeRangePreset;
  /** Inclusive start boundary. */
  from: Date;
  /** Exclusive end boundary (now). */
  to: Date;
  /** Stable cache key (e.g. "preset:30d"). */
  key: string;
};

// ---------- Internal constants ----------

const VALID_PRESETS = new Set<TimeRangePreset>(['7d', '30d', '90d']);

const PRESET_DAYS: Record<TimeRangePreset, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const DEFAULT_PRESET: TimeRangePreset = '30d';

// ---------- Internal helpers ----------

function isTimeRangePreset(value: string): value is TimeRangePreset {
  return VALID_PRESETS.has(value as TimeRangePreset);
}

function buildPresetTimeRange(preset: TimeRangePreset): TimeRange {
  const to = new Date();
  const from = new Date(
    to.getTime() - PRESET_DAYS[preset] * 24 * 60 * 60 * 1000,
  );

  return {
    kind: 'preset',
    preset,
    from,
    to,
    key: `preset:${preset}`,
  };
}

// ---------- Public API ----------

/**
 * Parses `range` from searchParams and returns a normalized TimeRange.
 * Falls back to 30d if missing or invalid.
 */
export function parseTimeRange(searchParams: SearchParams): TimeRange {
  const raw = searchParams.range;
  const scalar = Array.isArray(raw) ? raw[0] : raw;

  const preset: TimeRangePreset =
    scalar && isTimeRangePreset(scalar) ? scalar : DEFAULT_PRESET;

  return buildPresetTimeRange(preset);
}