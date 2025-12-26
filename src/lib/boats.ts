// Boat/Vessel API types and utilities
// API Base: https://api.bridgeup.app

export interface VesselPosition {
  lat: number;
  lon: number;
}

export interface VesselDimensions {
  length: number;
  width: number;
}

export interface VesselApiData {
  mmsi: number;
  name: string | null;
  type_name: string;
  type_category: string;
  position: VesselPosition;
  heading: number | null;
  course: number;
  speed_knots: number;
  destination: string | null;
  dimensions: VesselDimensions | null;
  last_seen: string;
  source: string;
  region: string;
}

export interface BoatsApiResponse {
  last_updated: string;
  vessel_count: number;
  status: {
    udp: Record<string, { active: boolean; last_message: string }>;
    aishub: {
      ok: boolean;
      last_poll: string;
      last_error: string | null;
      failure_count: number;
    };
  };
  vessels: VesselApiData[];
}

// Normalized vessel for component usage
export interface Vessel {
  mmsi: number;
  name: string;
  typeCategory: string;
  typeName: string;
  lat: number;
  lng: number;
  heading: number | null;
  course: number;
  speedKnots: number;
  destination: string | null;
  dimensions: VesselDimensions | null;
  lastSeen: string;
  region: string;
  source: string;
  emoji: string;
}

// Vessel type categories to emoji mapping
// Categories from API: "Cargo", "Tanker", "Passenger", "Pleasure Craft", "Sailing", "Tug", etc.
export function getVesselEmoji(typeCategory: string): string {
  const category = typeCategory.toLowerCase();

  // Sailing vessels
  if (category.includes("sail")) {
    return "⛵";
  }

  // Passenger vessels (ferry, cruise, etc.)
  if (category.includes("passenger") || category.includes("ferry") || category.includes("cruise")) {
    return "⛴️";
  }

  // Tankers
  if (category.includes("tanker")) {
    return "🛳️";
  }

  // Cargo vessels (cargo, bulk carrier, container, freighter)
  if (
    category.includes("cargo") ||
    category.includes("bulk") ||
    category.includes("container") ||
    category.includes("freighter")
  ) {
    return "🚢";
  }

  // Small motorized vessels (tugs, pleasure craft, workboats, fishing)
  // This is the default/fallback
  return "🛥️";
}

// Parse vessels from API response
export function parseVesselsFromApi(data: BoatsApiResponse): Vessel[] {
  return data.vessels.map((vessel) => ({
    mmsi: vessel.mmsi,
    name: vessel.name || `Vessel ${vessel.mmsi}`,
    typeCategory: vessel.type_category,
    typeName: vessel.type_name,
    lat: vessel.position.lat,
    lng: vessel.position.lon,
    heading: vessel.heading,
    course: vessel.course,
    speedKnots: vessel.speed_knots,
    destination: vessel.destination,
    dimensions: vessel.dimensions,
    lastSeen: vessel.last_seen,
    region: vessel.region,
    source: vessel.source,
    emoji: getVesselEmoji(vessel.type_category),
  }));
}

// Fetch all vessels from the API
export async function fetchVessels(): Promise<Vessel[]> {
  const response = await fetch("https://api.bridgeup.app/boats", {
    next: { revalidate: 30 }, // Cache for 30 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vessels: ${response.status}`);
  }

  const data: BoatsApiResponse = await response.json();
  return parseVesselsFromApi(data);
}

// Format speed for display
export function formatSpeed(speedKnots: number): string {
  if (speedKnots < 0.5) {
    return "Stationary";
  }
  return `${speedKnots.toFixed(1)} knots`;
}

// Format vessel dimensions for display
export function formatDimensions(dimensions: VesselDimensions | null): string | null {
  if (!dimensions) return null;
  return `${dimensions.length}m × ${dimensions.width}m`;
}
