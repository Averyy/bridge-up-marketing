"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useBridges } from "@/lib/useBridges";
import { useBoats } from "@/lib/useBoats";
import { Bridge, BridgePrediction } from "@/lib/bridges";
import { Vessel, formatSpeed, formatDimensions } from "@/lib/boats";
import { useTranslations } from "next-intl";

interface SelectedBridge {
  type: "bridge";
  name: string;
  region: string;
  status: string;
  lastUpdated: string;
  prediction: BridgePrediction | null;
  lng: number;
  lat: number;
}

interface SelectedVessel {
  type: "vessel";
  name: string;
  emoji: string;
  typeName: string;
  speedKnots: number;
  destination: string | null;
  dimensions: { length: number; width: number } | null;
  heading: number | null;
  source: string;
  lng: number;
  lat: number;
}

type SelectedItem = SelectedBridge | SelectedVessel | null;

interface BridgeMapProps {
  focusedRegion?: string | null;
}

export default function BridgeMap({ focusedRegion }: BridgeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const bridgeMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const vesselMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const { bridges, loading, error } = useBridges();
  const { vessels } = useBoats(true); // Always fetch vessels
  const t = useTranslations("bridges");

  // Calculate distance between two lat/lng points in km (Haversine formula)
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find vessels closest to closing-soon or closed bridges
  const getClosestVesselIds = useCallback((): { closingSoon: Set<number>; closed: Set<number> } => {
    const closingSoonIds = new Set<number>();
    const closedIds = new Set<number>();

    // Only consider moving vessels (ignore stationary boats with speed < 0.5 knots)
    const movingVessels = vessels.filter(v => v.speedKnots >= 0.5);

    const MAX_DISTANCE_KM = 5; // Only consider boats within 5km

    // Closing soon bridges
    const closingSoonBridges = bridges.filter(b => b.status === "closingSoon");
    closingSoonBridges.forEach(bridge => {
      let closestMmsi: number | null = null;
      let minDistance = Infinity;
      movingVessels.forEach(vessel => {
        const distance = getDistance(bridge.lat, bridge.lng, vessel.lat, vessel.lng);
        if (distance < minDistance && distance <= MAX_DISTANCE_KM) {
          minDistance = distance;
          closestMmsi = vessel.mmsi;
        }
      });
      if (closestMmsi !== null) {
        closingSoonIds.add(closestMmsi);
      }
    });

    // Closed bridges (excluding construction)
    const closedBridges = bridges.filter(b => b.status === "closed" || b.status === "closing");
    closedBridges.forEach(bridge => {
      let closestMmsi: number | null = null;
      let minDistance = Infinity;
      movingVessels.forEach(vessel => {
        const distance = getDistance(bridge.lat, bridge.lng, vessel.lat, vessel.lng);
        if (distance < minDistance && distance <= MAX_DISTANCE_KM) {
          minDistance = distance;
          closestMmsi = vessel.mmsi;
        }
      });
      if (closestMmsi !== null) {
        closedIds.add(closestMmsi);
      }
    });

    return { closingSoon: closingSoonIds, closed: closedIds };
  }, [bridges, vessels]);

  const updateCardPosition = useCallback(() => {
    if (!map.current || !selectedItem) return;
    const point = map.current.project([selectedItem.lng, selectedItem.lat]);
    const containerRect = mapContainer.current?.getBoundingClientRect();
    if (containerRect) {
      setCardPosition({
        x: containerRect.left + point.x,
        y: containerRect.top + point.y,
      });
    }
  }, [selectedItem]);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/mapbox/dark-v11",
      center: [-76.5, 44.0],
      zoom: 6,
      pitch: 0,
      bearing: 0,
    });

    map.current.on("load", () => {
      if (!map.current) return;
      setMapLoaded(true);

      // Close card when clicking on map
      map.current.on("click", () => {
        setSelectedItem(null);
      });

      // Navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      // Vessel tracking bounding boxes visualization
      // Welland Canal bounding box (~20km buffer)
      map.current.addSource("welland-bbox", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Welland Canal" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-79.40, 42.70],
              [-79.05, 42.70],
              [-79.05, 43.40],
              [-79.40, 43.40],
              [-79.40, 42.70],
            ]],
          },
        },
      });

      map.current.addLayer({
        id: "welland-bbox-line",
        type: "line",
        source: "welland-bbox",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#000000",
          "line-width": 1,
          "line-dasharray": [4, 2],
        },
      });

      // Montreal South Shore bounding box (~25km buffer)
      map.current.addSource("montreal-bbox", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Montreal South Shore" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-74.35, 45.05],
              [-73.20, 45.05],
              [-73.20, 45.70],
              [-74.35, 45.70],
              [-74.35, 45.05],
            ]],
          },
        },
      });

      map.current.addLayer({
        id: "montreal-bbox-line",
        type: "line",
        source: "montreal-bbox",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#000000",
          "line-width": 1,
          "line-dasharray": [4, 2],
        },
      });
    });

    return () => {
      bridgeMarkersRef.current.forEach((m) => m.remove());
      bridgeMarkersRef.current = [];
      vesselMarkersRef.current.forEach((m) => m.remove());
      vesselMarkersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Create/update bridge markers when bridges data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || bridges.length === 0) return;

    // Clear existing bridge markers
    bridgeMarkersRef.current.forEach((m) => m.remove());
    bridgeMarkersRef.current = [];

    // Create markers for each bridge
    bridges.forEach((bridge: Bridge) => {
      const el = document.createElement("div");
      el.className = "bridge-marker-wrapper";
      el.style.cssText = `
        width: 24px;
        height: 24px;
        cursor: pointer;
      `;

      const pin = document.createElement("div");
      pin.className = "bridge-marker-pin";

      // Set status color
      const color =
        bridge.status === "open"
          ? "#22c55e"
          : bridge.status === "closed"
            ? "#ef4444"
            : bridge.status === "closing"
              ? "#ef4444"
              : bridge.status === "closingSoon"
                ? "#eab308"
                : bridge.status === "opening"
                  ? "#f97316"
                  : bridge.status === "construction"
                    ? "#ef4444"
                    : "#6b7280";

      pin.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s ease;
      `;

      el.appendChild(pin);

      // Hover animation
      el.addEventListener("mouseenter", () => {
        pin.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        pin.style.transform = "scale(1)";
      });

      // Create marker - bridges have higher z-index than vessels
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([bridge.lng, bridge.lat])
        .addTo(map.current!);

      // Set higher z-index for bridge markers
      const markerEl = marker.getElement();
      markerEl.style.zIndex = "2";

      // Click handler
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = mapContainer.current?.getBoundingClientRect();
        const point = map.current!.project([bridge.lng, bridge.lat]);
        if (rect) {
          setSelectedItem({
            type: "bridge",
            name: bridge.name,
            region: bridge.region,
            status: bridge.status,
            lastUpdated: bridge.lastUpdated,
            prediction: bridge.prediction,
            lng: bridge.lng,
            lat: bridge.lat,
          });
          setCardPosition({
            x: rect.left + point.x,
            y: rect.top + point.y,
          });
        }
      });

      bridgeMarkersRef.current.push(marker);
    });
  }, [bridges, mapLoaded]);

  // Create/update vessel markers when vessels data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing vessel markers
    vesselMarkersRef.current.forEach((m) => m.remove());
    vesselMarkersRef.current = [];

    // If no vessels, nothing to render (not an error)
    if (vessels.length === 0) return;

    // Get vessels closest to closing-soon or closed bridges
    const { closingSoon: closingSoonIds, closed: closedIds } = getClosestVesselIds();

    // Create markers for each vessel
    vessels.forEach((vessel: Vessel) => {
      const el = document.createElement("div");
      el.className = "vessel-marker-wrapper";
      el.style.cssText = `
        width: 20px;
        height: 20px;
        cursor: pointer;
      `;

      // Check if this vessel is closest to a closing-soon or closed bridge
      const isClosestToClosingSoon = closingSoonIds.has(vessel.mmsi);
      const isClosestToClosed = closedIds.has(vessel.mmsi);
      const isHighlighted = isClosestToClosingSoon || isClosestToClosed;

      // Inner container for styling (don't transform the wrapper - Mapbox uses it for positioning)
      const inner = document.createElement("div");
      // Speed tiers: <0.5 knot = stationary, 0.5-2 = slow, 2-4 = moderate, 4+ = fast
      const isMoving = vessel.speedKnots >= 0.5;
      // Boats closest to closing-soon or closed bridges stay fully visible (likely waiting)
      const isActive = isMoving || isHighlighted;

      // Border style: dashed yellow for closing-soon (priority), dashed red for closed
      let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
      if (isClosestToClosingSoon) {
        borderStyle = "1px dashed #FBBF24"; // Dashed yellow
      } else if (isClosestToClosed) {
        borderStyle = "1px dashed #EF4444"; // Dashed red
      }

      inner.style.cssText = `
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        border: ${borderStyle};
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s ease;
        position: relative;
        opacity: ${isActive ? 1 : 0.7};
        transform: scale(${isActive ? 1 : 0.85});
      `;

      // EMOJI DIRECTION:
      // Emojis face LEFT (270°/West) by default
      // AIS heading: 0° = North, 90° = East, 180° = South, 270° = West
      // When heading is on the right side (1°-179°), we flip horizontally to avoid upside-down emoji
      const heading = vessel.heading ?? vessel.course ?? 0;

      // Right side of compass (heading toward East) - flip emoji and adjust rotation
      const isRightSide = heading > 0 && heading < 180;
      const scaleX = isRightSide ? -1 : 1;
      // Flipped emoji faces right, so rotation = heading - 90
      // Non-flipped emoji faces left, so rotation = heading + 90
      const emojiRotation = isRightSide ? heading - 90 : heading + 90;

      const emojiEl = document.createElement("span");
      emojiEl.textContent = vessel.emoji;
      // Order matters: rotate() then scaleX() means flip happens first, then rotation
      // This ensures rotation behaves normally on the already-flipped emoji
      emojiEl.style.cssText = `
        display: block;
        font-size: 12px;
        line-height: 1;
        transform: rotate(${emojiRotation}deg) scaleX(${scaleX});
        position: relative;
        z-index: 2;
      `;
      inner.appendChild(emojiEl);

      // WAKE DIRECTION:
      // Wake appears BEHIND the boat (opposite to travel direction)
      // Boat travels toward heading H, wake trails at H + 180°
      // Convert to CSS coordinates: 0° = right, 90° = down
      // CSS angle = compass angle - 90° (since CSS 0° is East, compass 0° is North)
      // Wake CSS angle = (heading + 180) - 90 = heading + 90
      //
      // Speed tiers for wake dots:
      // < 0.5 knot: no wake (stationary)
      // 0.5-2 knots: 1 dot
      // 2-4 knots: 2 dots
      // 4+ knots: 3 dots
      if (isMoving) {
        const wakeCssAngle = (heading + 90) * Math.PI / 180;
        const speed = vessel.speedKnots;
        const wakeDots = speed >= 4 ? 3 : speed >= 2 ? 2 : 1;
        // Faster boats = faster animation (1.2s slow, 0.9s medium, 0.6s fast)
        const animDuration = speed >= 4 ? 0.6 : speed >= 2 ? 0.9 : 1.2;
        const animDelay2 = animDuration * 0.3; // Stagger at ~30% of duration
        const animDelay3 = animDuration * 0.6; // Stagger at ~60% of duration

        // First wake dot (closest to boat)
        const wakeX1 = Math.cos(wakeCssAngle) * 12;
        const wakeY1 = Math.sin(wakeCssAngle) * 12;
        const wake1 = document.createElement("div");
        wake1.className = "vessel-wake";
        wake1.style.cssText = `
          position: absolute;
          width: 5px;
          height: 5px;
          background: rgba(120, 180, 255, 0.9);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + ${wakeX1}px), calc(-50% + ${wakeY1}px));
          animation: vesselWake ${animDuration}s ease-out infinite;
          z-index: 1;
          pointer-events: none;
        `;
        inner.appendChild(wake1);

        // Second wake dot (medium distance)
        if (wakeDots >= 2) {
          const wakeX2 = Math.cos(wakeCssAngle) * 17;
          const wakeY2 = Math.sin(wakeCssAngle) * 17;
          const wake2 = document.createElement("div");
          wake2.className = "vessel-wake";
          wake2.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(120, 180, 255, 0.7);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(calc(-50% + ${wakeX2}px), calc(-50% + ${wakeY2}px));
            animation: vesselWake ${animDuration}s ease-out infinite ${animDelay2}s;
            z-index: 1;
            pointer-events: none;
          `;
          inner.appendChild(wake2);
        }

        // Third wake dot (furthest from boat)
        if (wakeDots >= 3) {
          const wakeX3 = Math.cos(wakeCssAngle) * 22;
          const wakeY3 = Math.sin(wakeCssAngle) * 22;
          const wake3 = document.createElement("div");
          wake3.className = "vessel-wake";
          wake3.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(120, 180, 255, 0.5);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(calc(-50% + ${wakeX3}px), calc(-50% + ${wakeY3}px));
            animation: vesselWake ${animDuration}s ease-out infinite ${animDelay3}s;
            z-index: 1;
            pointer-events: none;
          `;
          inner.appendChild(wake3);
        }
      }

      el.appendChild(inner);

      const baseScale = isActive ? 1 : 0.85;
      el.addEventListener("mouseenter", () => {
        inner.style.transform = `scale(${baseScale * 1.3})`;
      });

      el.addEventListener("mouseleave", () => {
        inner.style.transform = `scale(${baseScale})`;
      });

      // Create marker - vessels have lower z-index than bridges
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([vessel.lng, vessel.lat])
        .addTo(map.current!);

      // Set lower z-index for vessel markers
      const markerEl = marker.getElement();
      markerEl.style.zIndex = "1";

      // Click handler
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = mapContainer.current?.getBoundingClientRect();
        const point = map.current!.project([vessel.lng, vessel.lat]);
        if (rect) {
          setSelectedItem({
            type: "vessel",
            name: vessel.name,
            emoji: vessel.emoji,
            typeName: vessel.typeName,
            speedKnots: vessel.speedKnots,
            destination: vessel.destination,
            dimensions: vessel.dimensions,
            heading: vessel.heading,
            source: vessel.source,
            lng: vessel.lng,
            lat: vessel.lat,
          });
          setCardPosition({
            x: rect.left + point.x,
            y: rect.top + point.y,
          });
        }
      });

      vesselMarkersRef.current.push(marker);
    });
  }, [vessels, mapLoaded, getClosestVesselIds]);

  useEffect(() => {
    if (!map.current || !selectedItem) return;

    updateCardPosition();

    const handleMove = () => updateCardPosition();
    map.current.on("move", handleMove);

    return () => {
      map.current?.off("move", handleMove);
    };
  }, [selectedItem, updateCardPosition]);

  // Zoom to region when focusedRegion changes
  useEffect(() => {
    if (!map.current || !focusedRegion || bridges.length === 0) return;

    // Get bridges for this region
    const regionBridges = bridges.filter((b: Bridge) => b.regionId === focusedRegion);
    if (regionBridges.length === 0) return;

    // Close any open popup - intentional: popup should close when switching regions
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedItem(null);

    // Calculate bounds for the region
    const bounds = new mapboxgl.LngLatBounds();
    regionBridges.forEach((bridge: Bridge) => {
      bounds.extend([bridge.lng, bridge.lat]);
    });

    // Region-specific zoom settings
    const maxZoom = focusedRegion === "port-colborne" ? 13 : 11;

    // Fit to bounds with padding for nav (top) and cards (bottom)
    map.current.fitBounds(bounds, {
      padding: { top: 160, bottom: 320, left: 80, right: 80 },
      maxZoom,
      duration: 1000,
    });
  }, [focusedRegion, bridges]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      case "closing":
        return "bg-red-500";
      case "closingSoon":
        return "bg-yellow-500";
      case "opening":
        return "bg-orange-500";
      case "construction":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "closing":
        return "Closing";
      case "closingSoon":
        return "Closing Soon";
      case "opening":
        return "Opening";
      case "construction":
        return "Construction";
      default:
        return "Unknown";
    }
  };

  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case "open":
        return "text-green-400";
      case "closed":
        return "text-red-400";
      case "closing":
        return "text-red-400";
      case "closingSoon":
        return "text-yellow-400";
      case "opening":
        return "text-orange-400";
      case "construction":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Generate dynamic info text based on status and prediction (matching iOS app)
  const getInfoText = (status: string, prediction: BridgePrediction | null): string => {
    switch (status) {
      case "open":
        return "Clear to cross";
      case "closingSoon":
        if (prediction?.closesIn) {
          return `Closes in ${prediction.closesIn.min}-${prediction.closesIn.max}m`;
        }
        return "Prepare for closure";
      case "closing":
        return "Bridge is raising";
      case "closed":
        if (prediction?.opensIn) {
          if (prediction.opensIn.min === prediction.opensIn.max) {
            return `Opens in ~${prediction.opensIn.min}m`;
          }
          return `Opens in ${prediction.opensIn.min}-${prediction.opensIn.max}m`;
        }
        return "Closed, unknown opening time";
      case "opening":
        return "Will be open in a few moments";
      case "construction":
        return "Closed for maintenance";
      default:
        return "Status unavailable";
    }
  };

  // Format last updated time
  const formatLastUpdated = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();

    if (isToday) {
      return timeStr;
    }

    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${dateStr}, ${timeStr}`;
  };

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-white">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm">{t("loadingMap")}</span>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)]/50 backdrop-blur-sm">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-red-300 text-sm">
            Failed to load bridge data
          </div>
        </div>
      )}

      {/* Bridge popup card */}
      {selectedItem && selectedItem.type === "bridge" && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cardPosition.x,
            top: cardPosition.y - 16,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="rounded-xl shadow-xl px-4 py-3 pointer-events-auto min-w-[200px] border border-white/10" style={{ background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(12px)' }}>
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedItem.status)}`} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${getStatusTextColor(selectedItem.status)}`}>
                {getStatusText(selectedItem.status)}
              </span>
            </div>
            {/* Bridge name */}
            <p className="font-semibold text-white text-sm">{selectedItem.name}</p>
            {/* Dynamic info text */}
            <p className="text-xs text-gray-300 mt-0.5">
              {getInfoText(selectedItem.status, selectedItem.prediction)}
            </p>
            {/* Footer with region and last updated */}
            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-gray-500">{selectedItem.region}</span>
              <span className="text-[10px] text-gray-500">
                Changed at {formatLastUpdated(selectedItem.lastUpdated)}
              </span>
            </div>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]" style={{ borderTopColor: 'rgba(10, 10, 10, 0.75)' }} />
          </div>
        </div>
      )}

      {/* Vessel popup card */}
      {selectedItem && selectedItem.type === "vessel" && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cardPosition.x,
            top: cardPosition.y - 16,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="rounded-xl shadow-xl px-4 py-3 pointer-events-auto min-w-[200px] max-w-[280px] border border-white/10" style={{ background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm flex-shrink-0">{selectedItem.emoji}</span>
              <p className="font-semibold text-white text-sm truncate capitalize">{selectedItem.name.toLowerCase()}</p>
            </div>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
              <dt className="text-gray-500">Type</dt>
              <dd className="text-gray-300">{selectedItem.typeName}</dd>
              <dt className="text-gray-500">Heading</dt>
              <dd className="text-gray-300">{selectedItem.heading != null ? `${Math.round(selectedItem.heading)}°` : "N/A"}</dd>
              <dt className="text-gray-500">Speed</dt>
              <dd className="text-gray-300">{formatSpeed(selectedItem.speedKnots)}</dd>
              {selectedItem.destination && (
                <>
                  <dt className="text-gray-500">Dest</dt>
                  <dd className="text-gray-300 truncate capitalize">{selectedItem.destination.toLowerCase()}</dd>
                </>
              )}
              {selectedItem.dimensions && (
                <>
                  <dt className="text-gray-500">Size</dt>
                  <dd className="text-gray-300">{formatDimensions(selectedItem.dimensions)}</dd>
                </>
              )}
              <dt className="text-gray-500">Source</dt>
              <dd className="text-gray-300">{selectedItem.source}</dd>
            </dl>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]" style={{ borderTopColor: 'rgba(10, 10, 10, 0.75)' }} />
          </div>
        </div>
      )}

      <style jsx global>{`
        .mapboxgl-ctrl-group {
          background: rgba(10, 10, 10, 0.8) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-group button {
          background: transparent !important;
          border: none !important;
        }
        .mapboxgl-ctrl-group button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
          filter: invert(1);
        }
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
        @keyframes vesselWake {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            scale: 1.3;
          }
        }
      `}</style>
    </>
  );
}
