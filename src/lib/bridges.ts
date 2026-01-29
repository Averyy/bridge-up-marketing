// Bridge API types and utilities
// API Base: https://api.bridgeup.app

export interface BridgeCoordinates {
  lat: number;
  lng: number;
}

export interface BridgeStatistics {
  averageDuration?: number;
  medianDuration?: number;
  closureCount?: number;
}

export interface BridgePrediction {
  opensIn?: { min: number; max: number };
  closesIn?: { min: number; max: number };
}

// Upcoming closure info (from API)
export interface UpcomingClosure {
  type: string;
  time: string;
  minutesUntil: number; // Calculated from time
  isOverdue: boolean;   // true if time has passed
}

// Future closure for display in popup (all scheduled closures)
export interface FutureClosure {
  type: string;
  time: string;
  endTime: string | null;
  formattedTimeRange: string; // Human-readable time range (e.g., "Thu, Mar 5 8am – 4pm")
}

// Raw prediction from API (timestamps)
interface RawPrediction {
  lower: string;
  upper: string;
}

// Raw upcoming closure from API
interface RawUpcomingClosure {
  type: string;
  time: string;
  longer: boolean;
  end_time: string | null;
  expected_duration_minutes: number;
}

export interface BridgeStatic {
  name: string;
  region: string;
  coordinates: BridgeCoordinates;
  statistics?: BridgeStatistics;
}

export interface BridgeLive {
  status: "Open" | "Closed" | "Closing soon" | "Opening" | "Construction";
  last_updated: string;
  predicted: RawPrediction | null;
  upcoming_closures: RawUpcomingClosure[];
  responsible_vessel_mmsi: number | null;
}

export interface BridgeData {
  static: BridgeStatic;
  live: BridgeLive;
}

export interface AvailableBridge {
  id: string;
  name: string;
  region_short: string;
  region: string;
}

export interface BridgesApiResponse {
  last_updated: string;
  available_bridges: AvailableBridge[];
  bridges: Record<string, BridgeData>;
}

// Normalized bridge for component usage
export interface Bridge {
  id: string;
  name: string;
  region: string;
  regionId: string;
  lat: number;
  lng: number;
  status: "open" | "closed" | "closing" | "closingSoon" | "opening" | "construction" | "unknown";
  lastUpdated: string;
  prediction: BridgePrediction | null;
  upcomingClosure: UpcomingClosure | null;
  futureClosures: FutureClosure[];
  responsibleVesselMmsi: number | null;
}

// Region with bridges for RegionCards
export interface Region {
  id: string;
  region: string;
  glowColor: string;
  bridges: { name: string; status: string }[];
}

// Map region names to IDs
function getRegionId(regionName: string): string {
  const regionMap: Record<string, string> = {
    "St Catharines": "st-catharines",
    "St. Catharines": "st-catharines",
    "Port Colborne": "port-colborne",
    "Montreal": "montreal",
    "Montreal South Shore": "montreal",
    "Beauharnois": "beauharnois",
    "Salaberry": "beauharnois",
    "Salaberry / Beauharnois / Suroît Region": "beauharnois",
    "Kahnawake": "kahnawake",
  };
  return regionMap[regionName] || regionName.toLowerCase().replace(/\s+/g, "-");
}

// Map region IDs to glow colors
function getRegionGlowColor(regionId: string): string {
  const colorMap: Record<string, string> = {
    "st-catharines": "#22c55e",
    "port-colborne": "#3b82f6",
    "montreal": "#8b5cf6",
    "beauharnois": "#f97316",
    "kahnawake": "#ec4899",
  };
  return colorMap[regionId] || "#6b7280";
}

// Normalize API status to component status
function normalizeStatus(
  apiStatus: string
): "open" | "closed" | "closing" | "closingSoon" | "opening" | "construction" | "unknown" {
  const statusMap: Record<string, "open" | "closed" | "closing" | "closingSoon" | "opening" | "construction" | "unknown"> = {
    "Open": "open",
    "Closed": "closed",
    "Closing": "closing",
    "Closing soon": "closingSoon",
    "Opening": "opening",
    "Construction": "construction",
  };
  return statusMap[apiStatus] || "unknown";
}

// Convert raw prediction timestamps to minutes from now
function parsePrediction(
  raw: RawPrediction | null,
  status: string
): BridgePrediction | null {
  if (!raw) return null;

  const now = new Date();
  const lower = new Date(raw.lower);
  const upper = new Date(raw.upper);

  // Calculate minutes from now (minimum 0)
  const minMinutes = Math.max(0, Math.round((lower.getTime() - now.getTime()) / 60000));
  const maxMinutes = Math.max(0, Math.round((upper.getTime() - now.getTime()) / 60000));

  // Based on status, determine if this is opensIn or closesIn
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "closed" || normalizedStatus === "closing" || normalizedStatus === "construction") {
    return { opensIn: { min: minMinutes, max: maxMinutes } };
  } else if (normalizedStatus === "closingSoon" || normalizedStatus === "open") {
    return { closesIn: { min: minMinutes, max: maxMinutes } };
  }

  return null;
}

// Parse upcoming closure from API (only first one, only if < 60 min away or overdue)
function parseUpcomingClosure(
  raw: RawUpcomingClosure[] | null
): UpcomingClosure | null {
  if (!raw || raw.length === 0) return null;

  const closure = raw[0];
  const now = new Date();
  const closureTime = new Date(closure.time);
  const minutesUntil = Math.round((closureTime.getTime() - now.getTime()) / 60000);
  const isOverdue = minutesUntil < 0;

  // Only include if overdue or < 60 min away (matches iOS logic)
  if (!isOverdue && minutesUntil >= 60) return null;

  // Map closure type to display name (matches iOS BridgeInfoGenerator)
  let displayType = closure.type;
  if (closure.type === "Commercial Vessel" || closure.type === "Pleasure Craft" || closure.type === "Next Arrival") {
    displayType = "a boat";
  } else if (closure.type === "Construction") {
    displayType = "construction";
  }

  return {
    type: displayType,
    time: closure.time,
    minutesUntil: Math.abs(minutesUntil),
    isOverdue,
  };
}

// Format closure type for display
function formatClosureType(type: string): string {
  if (type === "Commercial Vessel" || type === "Pleasure Craft" || type === "Next Arrival") {
    return "Boat";
  } else if (type === "Construction") {
    return "Construction";
  }
  return type;
}

// Format time for display (e.g., "7:00am")
function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(" ", "").toLowerCase();
}

// Check if a date is at midnight (00:00)
function isMidnight(date: Date): boolean {
  return date.getHours() === 0 && date.getMinutes() === 0;
}

// Check if a date is at end of day (23:59)
function isEndOfDay(date: Date): boolean {
  return date.getHours() === 23 && date.getMinutes() === 59;
}

// Format a future closure time range for display
function formatFutureClosureTimeRange(startIso: string, endIso: string | null): string {
  const start = new Date(startIso);
  const now = new Date();
  const isToday = start.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = start.toDateString() === tomorrow.toDateString();

  // Build the date prefix for start
  let startDateStr: string;
  if (isToday) {
    startDateStr = "Today";
  } else if (isTomorrow) {
    startDateStr = "Tomorrow";
  } else {
    startDateStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  // If no end time, just show start with time
  if (!endIso) {
    return `${startDateStr} ${formatTimeShort(start)}`;
  }

  const end = new Date(endIso);
  const sameDay = start.toDateString() === end.toDateString();
  const isAllDay = isMidnight(start) && isEndOfDay(end);

  if (isAllDay) {
    // All-day event(s) - don't show times
    if (sameDay) {
      // Single all-day: "Thu, Mar 5 (all day)"
      return `${startDateStr} (all day)`;
    } else {
      // Multi-day all-day: "Sat, Jan 10 – Fri, Feb 6 (all day)"
      const endDateStr = end.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      return `${startDateStr} – ${endDateStr} (all day)`;
    }
  }

  // Not all-day, show times
  if (sameDay) {
    // Same day: "Thu, Mar 5 8:00am – 4:00pm"
    return `${startDateStr} ${formatTimeShort(start)} – ${formatTimeShort(end)}`;
  } else {
    // Different days: "Thu, Mar 5 8:00am – Fri, Mar 6 4:00pm"
    const endDateStr = end.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return `${startDateStr} ${formatTimeShort(start)} – ${endDateStr} ${formatTimeShort(end)}`;
  }
}

// Parse all future closures from API (for display in popup)
function parseFutureClosures(raw: RawUpcomingClosure[] | null): FutureClosure[] {
  if (!raw || raw.length === 0) return [];

  const now = new Date();

  return raw
    .filter(closure => {
      const startTime = new Date(closure.time);
      const endTime = closure.end_time ? new Date(closure.end_time) : null;

      // Include if:
      // 1. Closure is in the future (hasn't started yet)
      // 2. Closure is currently active (started but not ended)
      const isInFuture = startTime.getTime() > now.getTime();
      const isCurrentlyActive = endTime
        ? (startTime.getTime() <= now.getTime() && now.getTime() <= endTime.getTime())
        : false;

      return isInFuture || isCurrentlyActive;
    })
    .map(closure => ({
      type: formatClosureType(closure.type),
      time: closure.time,
      endTime: closure.end_time,
      formattedTimeRange: formatFutureClosureTimeRange(closure.time, closure.end_time),
    }));
}

// Parse bridges from API response (used by both REST and WebSocket)
export function parseBridgesFromApi(data: BridgesApiResponse): Bridge[] {
  return Object.entries(data.bridges).map(([id, bridge]) => ({
    id,
    name: bridge.static.name,
    region: bridge.static.region,
    regionId: getRegionId(bridge.static.region),
    lat: bridge.static.coordinates.lat,
    lng: bridge.static.coordinates.lng,
    status: normalizeStatus(bridge.live.status),
    lastUpdated: bridge.live.last_updated,
    prediction: parsePrediction(bridge.live.predicted, bridge.live.status),
    upcomingClosure: parseUpcomingClosure(bridge.live.upcoming_closures),
    futureClosures: parseFutureClosures(bridge.live.upcoming_closures),
    responsibleVesselMmsi: bridge.live.responsible_vessel_mmsi ?? null,
  }));
}

// Fetch all bridges from the API
export async function fetchBridges(): Promise<Bridge[]> {
  const response = await fetch("https://api.bridgeup.app/bridges", {
    next: { revalidate: 30 }, // Cache for 30 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bridges: ${response.status}`);
  }

  const data: BridgesApiResponse = await response.json();
  return parseBridgesFromApi(data);
}

// Format last updated time for display
export function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(" ", "").toLowerCase();

  if (isToday) {
    return timeStr;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + timeStr;
}

// Generate status info text based on status and prediction (source of truth for all components)
// Priority: upcomingClosure > prediction > fallback (matches iOS BridgeInfoGenerator)
export function getStatusInfoText(
  status: string,
  prediction: BridgePrediction | null,
  lastUpdated?: string,
  upcomingClosure?: UpcomingClosure | null
): string {
  switch (status) {
    case "open":
      if (lastUpdated) {
        return `Opened ${formatLastUpdated(lastUpdated)}`;
      }
      return "Open";

    case "closingSoon":
      // 1. Check upcoming_closures FIRST (highest priority - matches iOS)
      if (upcomingClosure) {
        if (upcomingClosure.isOverdue) {
          // Closure time has passed
          const overdueTime = new Date(upcomingClosure.time);
          const timeStr = overdueTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
          return `Closing soon for ${upcomingClosure.type} (was expected at ${timeStr})`;
        }
        // Closure time is in future and < 60 min away
        return `Closing soon for ${upcomingClosure.type} in about ${upcomingClosure.minutesUntil}m`;
      }

      // 2. Fall back to predicted (statistics-based)
      if (prediction?.closesIn) {
        if (prediction.closesIn.min === 0 && prediction.closesIn.max === 0) {
          return "Closing soon (longer than usual)";
        }
        return `Closing soon in ${prediction.closesIn.min}-${prediction.closesIn.max}m`;
      }

      // 3. Default fallback
      return "Closing soon";

    case "closing":
      return "Just missed it, the bridge is closing";

    case "closed":
      if (prediction?.opensIn) {
        if (prediction.opensIn.min === 0 && prediction.opensIn.max === 0) {
          if (lastUpdated) {
            return `Closed ${formatLastUpdated(lastUpdated)} (longer than usual)`;
          }
          return "Closed (longer than usual)";
        }
        if (prediction.opensIn.min === prediction.opensIn.max) {
          return `Closed, opens in ~${prediction.opensIn.min}m`;
        }
        return `Closed, opens in ${prediction.opensIn.min}-${prediction.opensIn.max}m`;
      }
      if (lastUpdated) {
        return `Closed ${formatLastUpdated(lastUpdated)} (longer than usual)`;
      }
      return "Closed (longer than usual)";

    case "opening":
      return "Will be open in a few moments";

    case "construction":
      if (prediction?.opensIn) {
        const min = prediction.opensIn.min;
        if (min > 24 * 60) {
          const days = Math.floor(min / (24 * 60));
          return `Closed for construction, opens in ${days}d`;
        } else if (min >= 60) {
          const hours = Math.floor(min / 60);
          const mins = min % 60;
          if (mins > 0) {
            return `Closed for construction, opens in ${hours}h ${mins}m`;
          }
          return `Closed for construction, opens in ${hours}h`;
        } else if (min > 0) {
          return `Closed for construction, opens in ${min}m`;
        }
      }
      return "Closed for unscheduled construction, unknown opening";

    default:
      return "Bridge status is unknown or unavailable";
  }
}

// Group bridges by region for RegionCards
export function groupBridgesByRegion(bridges: Bridge[]): Region[] {
  const regionOrder = ["st-catharines", "port-colborne", "montreal", "beauharnois", "kahnawake"];
  const regionNames: Record<string, string> = {
    "st-catharines": "St. Catharines",
    "port-colborne": "Port Colborne",
    "montreal": "Montréal",
    "beauharnois": "Beauharnois",
    "kahnawake": "Kahnawake",
  };

  const grouped = bridges.reduce(
    (acc, bridge) => {
      const regionId = bridge.regionId;
      if (!acc[regionId]) {
        acc[regionId] = [];
      }
      acc[regionId].push({ name: bridge.name, status: bridge.status });
      return acc;
    },
    {} as Record<string, { name: string; status: string }[]>
  );

  return regionOrder
    .filter((id) => grouped[id])
    .map((id) => ({
      id,
      region: regionNames[id] || id,
      glowColor: getRegionGlowColor(id),
      bridges: grouped[id],
    }));
}
