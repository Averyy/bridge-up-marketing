"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useData } from "@/lib/useData";
import { Bridge, BridgePrediction, UpcomingClosure, FutureClosure, formatLastUpdated, getTranslatedStatusInfoText } from "@/lib/bridges";
import { Vessel, formatSpeed, formatDimensions } from "@/lib/boats";
import { useTranslations } from "next-intl";
import { BridgeStatusIcon, getStatusIconSvg, getWarningBadgeSvg } from "@/components/ui/BridgeStatusIcon";
import { useFloating, offset, flip, shift, autoUpdate, arrow, FloatingArrow } from "@floating-ui/react";

interface SelectedBridge {
  type: "bridge";
  name: string;
  region: string;
  status: string;
  lastUpdated: string;
  prediction: BridgePrediction | null;
  upcomingClosure: UpcomingClosure | null;
  futureClosures: FutureClosure[];
  lng: number;
  lat: number;
}

interface SelectedVessel {
  type: "vessel";
  mmsi: number; // Unique identifier for vessels
  name: string;
  emoji: string;
  typeName: string;
  speedKnots: number;
  destination: string | null;
  dimensions: { length: number; width: number } | null;
  heading: number | null;
  source: string;
  lastSeen: string;
  lng: number;
  lat: number;
}

type SelectedItem = SelectedBridge | SelectedVessel | null;

interface BridgeMapProps {
  focusedRegion?: string | null;
  onRegionClear?: () => void;
}

export default function BridgeMap({ focusedRegion, onRegionClear }: BridgeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const bridgeMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const vesselMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const lastAppliedRegionRef = useRef<string | null>(null);
  const isProgrammaticMoveRef = useRef(false);
  const onRegionClearRef = useRef(onRegionClear);
  const hasSetInitialMobileViewRef = useRef(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [vesselSecondsAgo, setVesselSecondsAgo] = useState(0);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isClickPinnedRef = useRef(false); // Track if popup was opened via click (for mobile)
  const selectedMarkerRef = useRef<HTMLElement | null>(null); // Track currently selected marker element

  // Floating UI for popup positioning
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: selectedItem !== null,
    placement: "top",
    middleware: [
      offset(16), // 16px gap from marker
      flip({
        fallbackPlacements: ["bottom", "left", "right"],
        padding: {
          top: 80,      // Navbar height + buffer
          bottom: isMobile ? 100 : 240,
          left: 12,
          right: 12,
        },
      }),
      shift({
        padding: {
          top: 80,
          bottom: isMobile ? 100 : 240,
          left: 12,
          right: 12,
        },
      }),
      arrow({ element: arrowElement }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const { bridges, vessels, loading, error } = useData();
  const t = useTranslations("bridges");
  const tStatus = useTranslations("bridgeStatus");

  // Keep callback ref up to date
  useEffect(() => {
    onRegionClearRef.current = onRegionClear;
  }, [onRegionClear]);

  // Track mobile breakpoint for floating UI positioning
  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 1024);
    updateMobile(); // Set initial value
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  // Get responsible vessel MMSIs from bridge data (backend-provided)
  const getResponsibleVesselIds = useCallback((): { closingSoon: Set<number>; closed: Set<number> } => {
    const closingSoonIds = new Set<number>();
    const closedIds = new Set<number>();

    bridges.forEach(bridge => {
      if (bridge.responsibleVesselMmsi === null) return;

      if (bridge.status === "closingSoon") {
        closingSoonIds.add(bridge.responsibleVesselMmsi);
      } else if (bridge.status === "closed" || bridge.status === "closing") {
        closedIds.add(bridge.responsibleVesselMmsi);
      }
    });

    return { closingSoon: closingSoonIds, closed: closedIds };
  }, [bridges]);

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

      // Close card when clicking on map (handles both hover and click-pinned popups)
      map.current.on("click", () => {
        // Reset z-index of previously selected marker
        if (selectedMarkerRef.current) {
          const prevMarker = selectedMarkerRef.current.closest('.mapboxgl-marker') as HTMLElement;
          if (prevMarker) {
            prevMarker.style.zIndex = prevMarker.dataset.originalZIndex || "2";
          }
        }
        setSelectedItem(null);
        refs.setReference(null);
        isClickPinnedRef.current = false;
        selectedMarkerRef.current = null;
      });

      // Clear region selection when user manually interacts with map
      const handleUserInteraction = () => {
        if (!isProgrammaticMoveRef.current && onRegionClearRef.current) {
          onRegionClearRef.current();
          lastAppliedRegionRef.current = null;
        }
      };

      map.current.on("dragstart", handleUserInteraction);
      map.current.on("wheel", handleUserInteraction);

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
  }, [refs]);

  // Create/update bridge markers when bridges data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || bridges.length === 0) return;

    // Check if selected bridge still exists in new data before clearing
    // Only close popup if selected bridge was removed
    if (bridgeMarkersRef.current.length > 0 && selectedItem?.type === "bridge") {
      const selectedBridgeExists = bridges.some(b => b.name === selectedItem.name);
      if (!selectedBridgeExists) {
        setSelectedItem(null);
        refs.setReference(null);
        isClickPinnedRef.current = false;
        selectedMarkerRef.current = null;
      }
    }

    // Clear existing bridge markers
    bridgeMarkersRef.current.forEach((m) => m.remove());
    bridgeMarkersRef.current = [];

    // Icon size for map markers (28px inside 30px container)
    const MAP_CONTAINER_SIZE = 30;
    const MAP_ICON_SIZE = 28;
    const BADGE_SIZE = 12;

    // Track element to bridge name mapping for popup re-anchoring
    const bridgeElementMap = new Map<string, HTMLElement>();

    // Create markers for each bridge
    bridges.forEach((bridge: Bridge) => {
      const el = document.createElement("div");
      el.className = "bridge-marker-wrapper";
      el.style.cssText = `
        width: ${MAP_CONTAINER_SIZE}px;
        height: ${MAP_CONTAINER_SIZE}px;
        cursor: pointer;
      `;

      const pin = document.createElement("div");
      pin.className = "bridge-marker-pin";

      // Dark circle container with thin dark gray border
      pin.style.cssText = `
        width: ${MAP_CONTAINER_SIZE}px;
        height: ${MAP_CONTAINER_SIZE}px;
        border-radius: 50%;
        background-color: #0A0A0A;
        border: 1px solid #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        position: relative;
      `;

      // Add the status icon using shared icon utility
      pin.innerHTML = getStatusIconSvg(bridge.status, MAP_ICON_SIZE);

      // Add warning badge for closingSoon (positioned at icon's bottom-right)
      if (bridge.status === "closingSoon") {
        const badge = document.createElement("div");
        badge.style.cssText = `
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: ${BADGE_SIZE}px;
          height: ${BADGE_SIZE}px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        badge.innerHTML = getWarningBadgeSvg(BADGE_SIZE);
        pin.appendChild(badge);
      }

      el.appendChild(pin);

      // Track element for popup re-anchoring
      bridgeElementMap.set(bridge.name, el);

      // Hover animation matching vessel markers (scale 1.3 with increased drop shadow)
      el.addEventListener("mouseenter", () => {
        pin.style.transform = "scale(1.3)";
        pin.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.6)";
      });
      el.addEventListener("mouseleave", () => {
        pin.style.transform = "scale(1)";
        pin.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.4)";
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

      // Store original z-index for restoration
      markerEl.dataset.originalZIndex = "2";

      // Click handler - toggle behavior for mobile support
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        // If clicking the same marker, close it
        if (selectedMarkerRef.current === el) {
          setSelectedItem(null);
          refs.setReference(null);
          isClickPinnedRef.current = false;
          selectedMarkerRef.current = null;
          markerEl.style.zIndex = "2"; // Reset z-index
        } else {
          // Reset previous marker's z-index
          if (selectedMarkerRef.current) {
            const prevMarker = selectedMarkerRef.current.closest('.mapboxgl-marker') as HTMLElement;
            if (prevMarker) prevMarker.style.zIndex = prevMarker.dataset.originalZIndex || "2";
          }
          refs.setReference(el);
          isClickPinnedRef.current = true; // Mark as click-opened
          selectedMarkerRef.current = el;
          markerEl.style.zIndex = "10"; // Bring to front
          setSelectedItem({
            type: "bridge",
            name: bridge.name,
            region: bridge.region,
            status: bridge.status,
            lastUpdated: bridge.lastUpdated,
            prediction: bridge.prediction,
            upcomingClosure: bridge.upcomingClosure,
            futureClosures: bridge.futureClosures,
            lng: bridge.lng,
            lat: bridge.lat,
          });
        }
      });

      // Hover handlers using Pointer Events (pointerType distinguishes mouse vs touch)
      el.addEventListener("pointerenter", (e: PointerEvent) => {
        // Only handle mouse hover, not touch (touch uses click to toggle)
        if (e.pointerType !== "mouse") return;

        // Bring marker to front on hover
        markerEl.style.zIndex = "10";
        // Only show popup on hover if nothing is click-pinned, or if this is the pinned item
        if (!isClickPinnedRef.current || selectedMarkerRef.current === el) {
          refs.setReference(el);
          selectedMarkerRef.current = el;
          setSelectedItem({
            type: "bridge",
            name: bridge.name,
            region: bridge.region,
            status: bridge.status,
            lastUpdated: bridge.lastUpdated,
            prediction: bridge.prediction,
            upcomingClosure: bridge.upcomingClosure,
            futureClosures: bridge.futureClosures,
            lng: bridge.lng,
            lat: bridge.lat,
          });
        }
      });

      el.addEventListener("pointerleave", (e: PointerEvent) => {
        // Only handle mouse hover, not touch
        if (e.pointerType !== "mouse") return;

        // Reset z-index if not the pinned item
        if (selectedMarkerRef.current !== el || !isClickPinnedRef.current) {
          markerEl.style.zIndex = "2";
        }
        // Only close on mouseleave if not click-pinned
        if (!isClickPinnedRef.current) {
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (!relatedTarget?.closest('[data-floating-popup]')) {
            setSelectedItem(null);
            refs.setReference(null);
            selectedMarkerRef.current = null;
          }
        }
      });

      bridgeMarkersRef.current.push(marker);
    });

    // Re-anchor popup to new marker element if a bridge was selected
    if (selectedItem?.type === "bridge" && isClickPinnedRef.current) {
      const newEl = bridgeElementMap.get(selectedItem.name);
      if (newEl) {
        refs.setReference(newEl);
        selectedMarkerRef.current = newEl;
        // Update z-index to keep selected marker on top
        const markerEl = newEl.closest('.mapboxgl-marker') as HTMLElement;
        if (markerEl) markerEl.style.zIndex = "10";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedItem checked via ref pattern to avoid infinite loop
  }, [bridges, mapLoaded, refs]);

  // Create/update vessel markers when vessels data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Check if selected vessel still exists in new data before clearing
    // Only close popup if selected vessel was removed (by mmsi)
    if (vesselMarkersRef.current.length > 0 && selectedItem?.type === "vessel") {
      const selectedVesselExists = vessels.some(v => v.mmsi === selectedItem.mmsi);
      if (!selectedVesselExists) {
        setSelectedItem(null);
        refs.setReference(null);
        isClickPinnedRef.current = false;
        selectedMarkerRef.current = null;
      }
    }

    // Clear existing vessel markers
    vesselMarkersRef.current.forEach((m) => m.remove());
    vesselMarkersRef.current = [];

    // If no vessels, nothing to render (not an error)
    if (vessels.length === 0) return;

    // Get responsible vessels from backend-provided data
    const { closingSoon: closingSoonIds, closed: closedIds } = getResponsibleVesselIds();

    // Track element to vessel mmsi mapping for popup re-anchoring
    const vesselElementMap = new Map<number, HTMLElement>();

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

      // Track element for popup re-anchoring
      vesselElementMap.set(vessel.mmsi, el);

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

      // Store original z-index for restoration
      markerEl.dataset.originalZIndex = "1";

      // Click handler - toggle behavior for mobile support
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        // If clicking the same marker, close it
        if (selectedMarkerRef.current === el) {
          setSelectedItem(null);
          refs.setReference(null);
          isClickPinnedRef.current = false;
          selectedMarkerRef.current = null;
          markerEl.style.zIndex = "1"; // Reset z-index
        } else {
          // Reset previous marker's z-index
          if (selectedMarkerRef.current) {
            const prevMarker = selectedMarkerRef.current.closest('.mapboxgl-marker') as HTMLElement;
            if (prevMarker) prevMarker.style.zIndex = prevMarker.dataset.originalZIndex || "1";
          }
          refs.setReference(el);
          isClickPinnedRef.current = true; // Mark as click-opened
          selectedMarkerRef.current = el;
          markerEl.style.zIndex = "10"; // Bring to front
          setSelectedItem({
            type: "vessel",
            mmsi: vessel.mmsi,
            name: vessel.name,
            emoji: vessel.emoji,
            typeName: vessel.typeName,
            speedKnots: vessel.speedKnots,
            destination: vessel.destination,
            dimensions: vessel.dimensions,
            heading: vessel.heading,
            source: vessel.source,
            lastSeen: vessel.lastSeen,
            lng: vessel.lng,
            lat: vessel.lat,
          });
        }
      });

      // Hover handlers using Pointer Events (pointerType distinguishes mouse vs touch)
      el.addEventListener("pointerenter", (e: PointerEvent) => {
        // Only handle mouse hover, not touch (touch uses click to toggle)
        if (e.pointerType !== "mouse") return;

        // Bring marker to front on hover
        markerEl.style.zIndex = "10";
        // Only show popup on hover if nothing is click-pinned, or if this is the pinned item
        if (!isClickPinnedRef.current || selectedMarkerRef.current === el) {
          refs.setReference(el);
          selectedMarkerRef.current = el;
          setSelectedItem({
            type: "vessel",
            mmsi: vessel.mmsi,
            name: vessel.name,
            emoji: vessel.emoji,
            typeName: vessel.typeName,
            speedKnots: vessel.speedKnots,
            destination: vessel.destination,
            dimensions: vessel.dimensions,
            heading: vessel.heading,
            source: vessel.source,
            lastSeen: vessel.lastSeen,
            lng: vessel.lng,
            lat: vessel.lat,
          });
        }
      });

      el.addEventListener("pointerleave", (e: PointerEvent) => {
        // Only handle mouse hover, not touch
        if (e.pointerType !== "mouse") return;

        // Reset z-index if not the pinned item
        if (selectedMarkerRef.current !== el || !isClickPinnedRef.current) {
          markerEl.style.zIndex = "1";
        }
        // Only close on mouseleave if not click-pinned
        if (!isClickPinnedRef.current) {
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (!relatedTarget?.closest('[data-floating-popup]')) {
            setSelectedItem(null);
            refs.setReference(null);
            selectedMarkerRef.current = null;
          }
        }
      });

      vesselMarkersRef.current.push(marker);
    });

    // Re-anchor popup to new marker element if a vessel was selected
    if (selectedItem?.type === "vessel" && isClickPinnedRef.current) {
      const newEl = vesselElementMap.get(selectedItem.mmsi);
      if (newEl) {
        refs.setReference(newEl);
        selectedMarkerRef.current = newEl;
        // Update z-index to keep selected marker on top
        const markerEl = newEl.closest('.mapboxgl-marker') as HTMLElement;
        if (markerEl) markerEl.style.zIndex = "10";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedItem checked via ref pattern to avoid infinite loop
  }, [vessels, mapLoaded, getResponsibleVesselIds, refs]);

  // Update selected bridge popup with fresh data when bridges update
  // Extract identifiers for dependency tracking (avoids complex expressions in deps)
  const selectedBridgeName = selectedItem?.type === "bridge" ? selectedItem.name : null;
  useEffect(() => {
    if (!selectedItem || selectedItem.type !== "bridge") return;

    const freshBridge = bridges.find(b => b.name === selectedItem.name);
    if (freshBridge) {
      // Shallow equality check to avoid unnecessary re-renders
      const hasChanged =
        selectedItem.status !== freshBridge.status ||
        selectedItem.lastUpdated !== freshBridge.lastUpdated ||
        selectedItem.region !== freshBridge.region ||
        selectedItem.lng !== freshBridge.lng ||
        selectedItem.lat !== freshBridge.lat ||
        JSON.stringify(selectedItem.prediction) !== JSON.stringify(freshBridge.prediction) ||
        JSON.stringify(selectedItem.upcomingClosure) !== JSON.stringify(freshBridge.upcomingClosure) ||
        JSON.stringify(selectedItem.futureClosures) !== JSON.stringify(freshBridge.futureClosures);

      if (hasChanged) {
        setSelectedItem({
          type: "bridge",
          name: freshBridge.name,
          region: freshBridge.region,
          status: freshBridge.status,
          lastUpdated: freshBridge.lastUpdated,
          prediction: freshBridge.prediction,
          upcomingClosure: freshBridge.upcomingClosure,
          futureClosures: freshBridge.futureClosures,
          lng: freshBridge.lng,
          lat: freshBridge.lat,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally excludes selectedItem to avoid infinite loop; selectedBridgeName tracks identity
  }, [bridges, selectedBridgeName]);

  // Update selected vessel popup with fresh data when vessels update
  const selectedVesselMmsi = selectedItem?.type === "vessel" ? selectedItem.mmsi : null;
  useEffect(() => {
    if (!selectedItem || selectedItem.type !== "vessel") return;

    const freshVessel = vessels.find(v => v.mmsi === selectedItem.mmsi);
    if (freshVessel) {
      // Shallow equality check to avoid unnecessary re-renders
      const hasChanged =
        selectedItem.name !== freshVessel.name ||
        selectedItem.emoji !== freshVessel.emoji ||
        selectedItem.typeName !== freshVessel.typeName ||
        selectedItem.speedKnots !== freshVessel.speedKnots ||
        selectedItem.destination !== freshVessel.destination ||
        selectedItem.heading !== freshVessel.heading ||
        selectedItem.source !== freshVessel.source ||
        selectedItem.lastSeen !== freshVessel.lastSeen ||
        selectedItem.lng !== freshVessel.lng ||
        selectedItem.lat !== freshVessel.lat ||
        selectedItem.dimensions?.length !== freshVessel.dimensions?.length ||
        selectedItem.dimensions?.width !== freshVessel.dimensions?.width;

      if (hasChanged) {
        setSelectedItem({
          type: "vessel",
          mmsi: freshVessel.mmsi,
          name: freshVessel.name,
          emoji: freshVessel.emoji,
          typeName: freshVessel.typeName,
          speedKnots: freshVessel.speedKnots,
          destination: freshVessel.destination,
          dimensions: freshVessel.dimensions,
          heading: freshVessel.heading,
          source: freshVessel.source,
          lastSeen: freshVessel.lastSeen,
          lng: freshVessel.lng,
          lat: freshVessel.lat,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally excludes selectedItem to avoid infinite loop; selectedVesselMmsi tracks identity
  }, [vessels, selectedVesselMmsi]);

  // Zoom to region when focusedRegion changes
  useEffect(() => {
    if (!map.current || !focusedRegion || bridges.length === 0) return;

    // Only zoom if this is a NEW region selection, not just a bridges data update
    if (lastAppliedRegionRef.current === focusedRegion) return;

    // Get bridges for this region
    const regionBridges = bridges.filter((b: Bridge) => b.regionId === focusedRegion);
    if (regionBridges.length === 0) return;

    // Mark this region as applied so we don't re-zoom on bridges updates
    lastAppliedRegionRef.current = focusedRegion;

    // Close any open popup - intentional: popup should close when switching regions
     
    setSelectedItem(null);

    // Calculate bounds for the region
    const bounds = new mapboxgl.LngLatBounds();
    regionBridges.forEach((bridge: Bridge) => {
      bounds.extend([bridge.lng, bridge.lat]);
    });

    // Detect mobile (no large region cards at bottom)
    const isMobile = window.innerWidth < 1024;

    // Region-specific zoom settings
    let maxZoom = 11;
    if (focusedRegion === "port-colborne") {
      maxZoom = 13;
    }

    // Mark as programmatic so we don't clear region during animation
    isProgrammaticMoveRef.current = true;

    // Padding: desktop has large region cards at bottom, mobile has small pills
    // Mobile also shifts view north for St. Catharines (less bottom padding)
    const padding = isMobile
      ? { top: 120, bottom: focusedRegion === "st-catharines" ? 80 : 100, left: 40, right: 40 }
      : { top: 160, bottom: 320, left: 80, right: 80 };

    // Fit to bounds with responsive padding
    map.current.fitBounds(bounds, {
      padding,
      maxZoom,
      duration: 1000,
    });

    // Clear programmatic flag after animation completes
    setTimeout(() => {
      isProgrammaticMoveRef.current = false;
    }, 1100);
  }, [focusedRegion, bridges]);

  // Reset the applied region ref when focusedRegion is cleared (user deselects)
  useEffect(() => {
    if (!focusedRegion) {
      lastAppliedRegionRef.current = null;
    }
  }, [focusedRegion]);

  // Live counter for vessel "last seen" timestamp
  useEffect(() => {
    if (!selectedItem || selectedItem.type !== "vessel") {
      // Reset counter when no vessel selected - safe to call here
       
      setVesselSecondsAgo(0);
      return;
    }

    const lastSeenDate = new Date(selectedItem.lastSeen);

    const updateCounter = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      setVesselSecondsAgo(Math.max(0, Math.floor(diffMs / 1000)));
    };

    // Initial calculation
    updateCounter();

    // Update every second
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [selectedItem]);

  // Set initial mobile view to show St. Catharines + Port Colborne
  useEffect(() => {
    if (!map.current || !mapLoaded || bridges.length === 0) return;
    if (hasSetInitialMobileViewRef.current) return;

    // Mark as handled once we have data, even if we don't set a view
    // This prevents jumping to St. Catharines if user later deselects a URL-based region
    hasSetInitialMobileViewRef.current = true;

    // Don't override if a region is already focused (e.g., from URL param)
    if (focusedRegion) return;

    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    // Get bridges for St. Catharines and Port Colborne
    const wellandBridges = bridges.filter(
      (b: Bridge) => b.regionId === "st-catharines" || b.regionId === "port-colborne"
    );
    if (wellandBridges.length === 0) return;

    // Calculate bounds for both regions
    const bounds = new mapboxgl.LngLatBounds();
    wellandBridges.forEach((bridge: Bridge) => {
      bounds.extend([bridge.lng, bridge.lat]);
    });

    // Mark as programmatic so we don't trigger region clear
    isProgrammaticMoveRef.current = true;

    // Fit bounds with padding for mobile
    map.current.fitBounds(bounds, {
      padding: { top: 100, bottom: 80, left: 40, right: 40 },
      maxZoom: 10,
      duration: 0, // Instant on load
    });

    // Clear programmatic flag
    setTimeout(() => {
      isProgrammaticMoveRef.current = false;
    }, 100);
  }, [mapLoaded, bridges, focusedRegion]);

  const getStatusText = (status: string): string => {
    // Short display labels using translations
    switch (status) {
      case "open":
        return tStatus("open");
      case "closed":
        return tStatus("closed");
      case "closing":
        return tStatus("closing");
      case "closingSoon":
        return tStatus("closingSoon");
      case "opening":
        return tStatus("opening");
      case "construction":
        return tStatus("construction");
      default:
        return tStatus("unknown");
    }
  };

  const getStatusTextColor = (status: string): string => {
    // Using spec hex colors
    switch (status) {
      case "open":
      case "closingSoon":
        return "text-[#30D158]";
      case "closed":
      case "closing":
      case "construction":
        return "text-[#FF453A]";
      case "opening":
        return "text-[#FFD60A]";
      default:
        return "text-[#98989D]";
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
            <span className="text-sm">{t("loadingMap")}</span>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-bg)]/50 backdrop-blur-sm">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-red-300 text-sm">
            {t("failedToLoad")}
          </div>
        </div>
      )}

      {/* Bridge popup card */}
      {selectedItem && selectedItem.type === "bridge" && (
        <div
           
          ref={refs.setFloating}
          data-floating-popup
          className="z-50"
          style={{
            ...floatingStyles,
            // Hide until positioned to prevent flash in top-left
            visibility: isPositioned ? 'visible' : 'hidden',
          }}
          onPointerLeave={(e) => {
            // Only close for mouse hover (not touch) and if not click-pinned
            if (e.pointerType === "mouse" && !isClickPinnedRef.current) {
              setSelectedItem(null);
              refs.setReference(null);
              selectedMarkerRef.current = null;
            }
          }}
        >
          <div className="rounded-xl shadow-xl px-4 py-3 min-w-[200px] border border-white/10" style={{ background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(12px)' }}>
            {/* Status with Phosphor icon */}
            <div className="flex items-center gap-2 mb-2">
              <div style={selectedItem.status === "closingSoon" ? { transform: "translateY(3px)" } : undefined}>
                <BridgeStatusIcon status={selectedItem.status} size={18} />
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${getStatusTextColor(selectedItem.status)}`}>
                {getStatusText(selectedItem.status)}
              </span>
            </div>
            {/* Bridge name */}
            <p className="font-semibold text-white text-sm">{selectedItem.name}</p>
            {/* Dynamic info text */}
            <p className="text-xs text-gray-300 mt-0.5">
              {getTranslatedStatusInfoText(tStatus, selectedItem.status, selectedItem.prediction, selectedItem.lastUpdated, selectedItem.upcomingClosure)}
            </p>
            {/* Closures list */}
            {selectedItem.futureClosures.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[10px] text-gray-500 tracking-wide">{t("closures")}</p>
                <ul>
                  {selectedItem.futureClosures.map((fc, idx) => (
                    <li key={idx} className="text-[10px] text-gray-500 leading-tight">
                      {fc.formattedTimeRange}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Footer with region and last updated */}
            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-gray-500">{selectedItem.region}</span>
              <span className="text-[10px] text-gray-500">
                {tStatus("changedAt", { time: formatLastUpdated(selectedItem.lastUpdated) })}
              </span>
            </div>
            <FloatingArrow
              ref={setArrowElement}
              context={context}
              fill="rgba(10, 10, 10, 0.75)"
              width={16}
              height={8}
            />
          </div>
        </div>
      )}

      {/* Vessel popup card */}
      {selectedItem && selectedItem.type === "vessel" && (
        <div
          ref={refs.setFloating}
          data-floating-popup
          className="z-50"
          style={{
            ...floatingStyles,
            // Hide until positioned to prevent flash in top-left
            visibility: isPositioned ? 'visible' : 'hidden',
          }}
          onPointerLeave={(e) => {
            // Only close for mouse hover (not touch) and if not click-pinned
            if (e.pointerType === "mouse" && !isClickPinnedRef.current) {
              setSelectedItem(null);
              refs.setReference(null);
              selectedMarkerRef.current = null;
            }
          }}
        >
          <div className="rounded-xl shadow-xl px-4 py-3 min-w-[200px] max-w-[280px] border border-white/10" style={{ background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm flex-shrink-0">{selectedItem.emoji}</span>
              <p className="font-semibold text-white text-sm truncate capitalize">{selectedItem.name.toLowerCase()}</p>
            </div>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
              <dt className="text-gray-500">{t("vesselType")}</dt>
              <dd className="text-gray-300">{selectedItem.typeName}</dd>
              <dt className="text-gray-500">{t("vesselHeading")}</dt>
              <dd className="text-gray-300">{selectedItem.heading != null ? `${Math.round(selectedItem.heading)}°` : "N/A"}</dd>
              <dt className="text-gray-500">{t("vesselSpeed")}</dt>
              <dd className="text-gray-300">{formatSpeed(selectedItem.speedKnots)}</dd>
              {selectedItem.destination?.trim() && (
                <>
                  <dt className="text-gray-500">{t("vesselDest")}</dt>
                  <dd className="text-gray-300 truncate capitalize">{selectedItem.destination.trim().toLowerCase()}</dd>
                </>
              )}
              {selectedItem.dimensions && (
                <>
                  <dt className="text-gray-500">{t("vesselSize")}</dt>
                  <dd className="text-gray-300">{formatDimensions(selectedItem.dimensions)}</dd>
                </>
              )}
            </dl>
            {/* Footer with source and live "last seen" counter */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10">
              <span className="text-[10px] text-gray-500">{selectedItem.source}</span>
              <span className="text-[10px] text-gray-500 tabular-nums">{t("secondsAgo", { seconds: vesselSecondsAgo })}</span>
            </div>
            <FloatingArrow
              ref={setArrowElement}
              context={context}
              fill="rgba(10, 10, 10, 0.75)"
              width={16}
              height={8}
            />
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
        .mapboxgl-ctrl-attrib,
        .mapboxgl-ctrl-logo {
          display: none !important;
        }
        /* Hide zoom controls on mobile */
        @media (max-width: 1023px) {
          .mapboxgl-ctrl-group {
            display: none !important;
          }
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
