// src/lib/bridgeStats.ts
//
// Server-only build-time fetch of raw bridge static data + statistics from the
// read-only /bridges API. INTENTIONALLY separate from parseBridgesFromApi() in
// bridges.ts (which strips statistics): the SEO pages need the full raw
// `static.statistics` block, refreshed daily via ISR. Read-only GET — no writes.

import { API_BASE_URL } from "./config";

export interface RawConfidenceInterval {
  lower: number;
  upper: number;
}

// Histogram of completed closure durations (counts). NOTE: these buckets sum to
// their OWN total, which is NOT total_entries — render percentages over the
// bucket sum (closureDurationsTotal), never over total_entries. Matches the iOS app.
export interface RawClosureDurations {
  under_9m: number;
  "10_15m": number;
  "16_30m": number;
  "31_60m": number;
  over_60m: number;
}

export interface RawBridgeStatistics {
  average_closure_duration?: number;
  closure_ci?: RawConfidenceInterval;
  average_raising_soon?: number;
  raising_soon_ci?: RawConfidenceInterval;
  closure_durations?: RawClosureDurations;
  // Count of closure AND closing-soon events the stats were computed from.
  total_entries?: number;
}

export interface RawBridgeStatic {
  name: string;
  region: string;
  region_short: string;
  coordinates: { lat: number; lng: number };
  statistics?: RawBridgeStatistics;
}

interface BridgesApiRaw {
  bridges?: Record<string, { static?: RawBridgeStatic }>;
}

const FETCH_TIMEOUT_MS = 10000;

async function fetchBridgesJson(): Promise<BridgesApiRaw> {
  // One retry — a transient blip at build shouldn't fail the whole deploy, but a
  // sustained outage should (we never want to ship empty stat pages).
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE_URL}/bridges`, {
        next: { revalidate: 86400 },
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch bridge statics: ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as BridgesApiRaw;
    } catch (err) {
      lastErr = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Failed to fetch bridge statics");
}

// All bridges' static data, keyed by API id. Daily ISR cache. Throws on failure.
export async function fetchBridgeStatics(): Promise<Record<string, RawBridgeStatic>> {
  const data = await fetchBridgesJson();
  const out: Record<string, RawBridgeStatic> = {};
  for (const [id, bridge] of Object.entries(data.bridges ?? {})) {
    if (bridge?.static) out[id] = bridge.static;
  }
  return out;
}

// Sum of the histogram buckets — the correct denominator for bucket percentages.
export function closureDurationsTotal(d: RawClosureDurations): number {
  return d.under_9m + d["10_15m"] + d["16_30m"] + d["31_60m"] + d.over_60m;
}
