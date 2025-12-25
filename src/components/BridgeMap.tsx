"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useBridges } from "@/lib/useBridges";
import { Bridge } from "@/lib/bridges";

interface SelectedBridge {
  name: string;
  region: string;
  status: string;
  lng: number;
  lat: number;
}

interface BridgeMapProps {
  focusedRegion?: string | null;
}

export default function BridgeMap({ focusedRegion }: BridgeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedBridge, setSelectedBridge] = useState<SelectedBridge | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);

  const { bridges, loading, error } = useBridges();

  const updateCardPosition = useCallback(() => {
    if (!map.current || !selectedBridge) return;
    const point = map.current.project([selectedBridge.lng, selectedBridge.lat]);
    const containerRect = mapContainer.current?.getBoundingClientRect();
    if (containerRect) {
      setCardPosition({
        x: containerRect.left + point.x,
        y: containerRect.top + point.y,
      });
    }
  }, [selectedBridge]);

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
        setSelectedBridge(null);
      });

      // Navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Create/update markers when bridges data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || bridges.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

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

      el.addEventListener("mouseenter", () => {
        pin.style.transform = "scale(1.2)";
      });

      el.addEventListener("mouseleave", () => {
        pin.style.transform = "scale(1)";
      });

      // Create marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([bridge.lng, bridge.lat])
        .addTo(map.current!);

      // Click handler
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = mapContainer.current?.getBoundingClientRect();
        const point = map.current!.project([bridge.lng, bridge.lat]);
        if (rect) {
          setSelectedBridge({
            name: bridge.name,
            region: bridge.region,
            status: bridge.status,
            lng: bridge.lng,
            lat: bridge.lat,
          });
          setCardPosition({
            x: rect.left + point.x,
            y: rect.top + point.y,
          });
        }
      });

      markersRef.current.push(marker);
    });
  }, [bridges, mapLoaded]);

  useEffect(() => {
    if (!map.current || !selectedBridge) return;

    updateCardPosition();

    const handleMove = () => updateCardPosition();
    map.current.on("move", handleMove);

    return () => {
      map.current?.off("move", handleMove);
    };
  }, [selectedBridge, updateCardPosition]);

  // Zoom to region when focusedRegion changes
  useEffect(() => {
    if (!map.current || !focusedRegion || bridges.length === 0) return;

    // Get bridges for this region
    const regionBridges = bridges.filter((b: Bridge) => b.regionId === focusedRegion);
    if (regionBridges.length === 0) return;

    // Close any open popup - intentional: popup should close when switching regions
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedBridge(null);

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
        return "text-green-600";
      case "closed":
        return "text-red-600";
      case "closing":
        return "text-red-600";
      case "closingSoon":
        return "text-yellow-600";
      case "opening":
        return "text-orange-600";
      case "construction":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-white">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Loading bridges...</span>
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

      {selectedBridge && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: cardPosition.x,
            top: cardPosition.y - 16,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white rounded-xl shadow-xl px-4 py-3 pointer-events-auto min-w-[180px]">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedBridge.status)}`} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${getStatusTextColor(selectedBridge.status)}`}>
                {getStatusText(selectedBridge.status)}
              </span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{selectedBridge.name}</p>
            <p className="text-xs text-gray-500">{selectedBridge.region}</p>
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
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
      `}</style>
    </>
  );
}
