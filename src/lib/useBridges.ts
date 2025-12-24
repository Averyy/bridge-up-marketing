"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { Bridge, Region, fetchBridges, groupBridgesByRegion, parseBridgesFromApi } from "./bridges";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface BridgesContextValue {
  bridges: Bridge[];
  regions: Region[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  connectionStatus: ConnectionStatus;
  refetch: () => Promise<void>;
}

const WS_URL = "wss://api.bridgeup.app/ws";
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

// Create context with default values
export const BridgesContext = createContext<BridgesContextValue | null>(null);

// Internal hook that manages the WebSocket connection - only used by the provider
export function useBridgesInternal(): BridgesContextValue {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch via REST (fallback)
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchBridges();
      setBridges(data);
      setRegions(groupBridgesByRegion(data));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bridges");
      console.error("Failed to fetch bridges:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] Connected to bridge updates");
        setConnectionStatus("connected");
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.bridges) {
            const parsedBridges = parseBridgesFromApi(data);
            setBridges(parsedBridges);
            setRegions(groupBridgesByRegion(parsedBridges));
            setLastUpdated(new Date());
            setLoading(false);
          }
        } catch (err) {
          console.error("[WS] Failed to parse message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("[WS] Error:", event);
        setConnectionStatus("error");
      };

      ws.onclose = (event) => {
        console.log("[WS] Disconnected:", event.code, event.reason);
        setConnectionStatus("disconnected");
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`[WS] Reconnecting in ${RECONNECT_DELAY}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
        } else {
          console.log("[WS] Max reconnect attempts reached, falling back to REST");
          setError("WebSocket disconnected, using REST fallback");
          // Fall back to REST polling
          fetchData();
        }
      };
    } catch (err) {
      console.error("[WS] Failed to connect:", err);
      setConnectionStatus("error");
      fetchData(); // Fall back to REST
    }
  }, [fetchData]);

  // Initial connection
  useEffect(() => {
    // First, fetch via REST for immediate data
    fetchData().then(() => {
      // Then connect to WebSocket for live updates
      connect();
    });

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, fetchData]);

  return {
    bridges,
    regions,
    loading,
    error,
    lastUpdated,
    connectionStatus,
    refetch: fetchData,
  };
}

// Hook to use bridges data - uses shared context
export function useBridges(): BridgesContextValue {
  const context = useContext(BridgesContext);

  // If used outside provider, return empty state (for SSR/initial render)
  if (!context) {
    return {
      bridges: [],
      regions: [],
      loading: true,
      error: null,
      lastUpdated: null,
      connectionStatus: "connecting",
      refetch: async () => {},
    };
  }

  return context;
}
