type LatLng = { lat: number; lng: number };

export type DriveTimeResult =
  | { ok: true; minutes: number }
  | { ok: false; reason: "MISSING_API_KEY" | "UNSUPPORTED" | "ERROR"; error?: string };

export function googleApiKey(): string | null {
  return process.env.GOOGLE_MAPS_API_KEY ?? null;
}

/**
 * Scaffolding only.
 *
 * When GOOGLE_MAPS_API_KEY is not set, we explicitly return a structured failure
 * so callers can fall back to seed/curated data.
 */
export async function driveTimeMinutes(_origin: LatLng, _dest: LatLng): Promise<DriveTimeResult> {
  const key = googleApiKey();
  if (!key) return { ok: false, reason: "MISSING_API_KEY" };

  // TODO: implement Google Distance Matrix call
  // https://developers.google.com/maps/documentation/distance-matrix
  // Note: consider caching + rate limiting.
  return { ok: false, reason: "UNSUPPORTED" };
}

/**
 * Scaffolding only for Google Directions (transit).
 */
export async function transitReturnSummary(_from: LatLng, _to: LatLng, _arriveByIso?: string) {
  const key = googleApiKey();
  if (!key) return { ok: false as const, reason: "MISSING_API_KEY" as const };
  // TODO: implement Directions API (mode=transit)
  return { ok: false as const, reason: "UNSUPPORTED" as const };
}
