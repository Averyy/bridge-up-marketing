"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Bridge data with coordinates (lng, lat order for Mapbox)
const bridges = [
  // St. Catharines (sorted north to south along the canal)
  { name: "Lakeshore Rd", region: "St. Catharines", regionId: "st-catharines", lat: 43.2162, lng: -79.2122, status: "open" },
  { name: "Carlton St.", region: "St. Catharines", regionId: "st-catharines", lat: 43.1919, lng: -79.2010, status: "open" },
  { name: "Queenston St.", region: "St. Catharines", regionId: "st-catharines", lat: 43.1658, lng: -79.1949, status: "closed" },
  { name: "Glendale Ave.", region: "St. Catharines", regionId: "st-catharines", lat: 43.1453, lng: -79.1923, status: "open" },
  { name: "Highway 20", region: "St. Catharines", regionId: "st-catharines", lat: 43.0765, lng: -79.2105, status: "open" },
  // Port Colborne (sorted north to south)
  { name: "Main St.", region: "Port Colborne", regionId: "port-colborne", lat: 42.9015, lng: -79.2454, status: "closing" },
  { name: "Mellanby Ave.", region: "Port Colborne", regionId: "port-colborne", lat: 42.8965, lng: -79.2466, status: "open" },
  { name: "Clarence St.", region: "Port Colborne", regionId: "port-colborne", lat: 42.8864, lng: -79.2486, status: "open" },
  // Montreal South Shore
  { name: "Victoria Bridge Downstream", region: "Montreal", regionId: "montreal", lat: 45.4955, lng: -73.5178, status: "open" },
  { name: "Victoria Bridge Upstream", region: "Montreal", regionId: "montreal", lat: 45.4923, lng: -73.5168, status: "open" },
  { name: "Sainte-Catherine Bridge", region: "Montreal", regionId: "montreal", lat: 45.4081, lng: -73.5673, status: "open" },
  // Salaberry / Beauharnois
  { name: "St-Louis-de-Gonzague Bridge", region: "Beauharnois", regionId: "beauharnois", lat: 45.2326, lng: -74.0030, status: "open" },
  { name: "Larocque Bridge", region: "Beauharnois", regionId: "beauharnois", lat: 45.2259, lng: -74.1148, status: "open" },
];

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

      // Use HTML markers for reliable styling
      bridges.forEach((bridge) => {
        // Create wrapper element (Mapbox positions this)
        const el = document.createElement("div");
        el.className = "bridge-marker-wrapper";
        el.style.cssText = `
          width: 24px;
          height: 24px;
          cursor: pointer;
        `;

        // Create inner pin element (this handles visual styling and hover)
        const pin = document.createElement("div");
        pin.className = "bridge-marker-pin";

        // Set status color
        const color = bridge.status === "open" ? "#22c55e" :
                      bridge.status === "closed" ? "#ef4444" :
                      bridge.status === "closing" ? "#f97316" : "#6b7280";

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
    if (!map.current || !focusedRegion) return;

    // Get bridges for this region
    const regionBridges = bridges.filter((b) => b.regionId === focusedRegion);
    if (regionBridges.length === 0) return;

    // Close any open popup
    setSelectedBridge(null);

    // Calculate bounds for the region
    const bounds = new mapboxgl.LngLatBounds();
    regionBridges.forEach((bridge) => {
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
  }, [focusedRegion]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "closed": return "bg-red-500";
      case "closing": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open": return "Open";
      case "closed": return "Closed";
      case "closing": return "Closing Soon";
      default: return "Unknown";
    }
  };

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />

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
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                selectedBridge.status === "open" ? "text-green-600" :
                selectedBridge.status === "closed" ? "text-red-600" : "text-orange-600"
              }`}>
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
