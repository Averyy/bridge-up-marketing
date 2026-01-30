"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Bridge, Region, fetchBridges, groupBridgesByRegion, parseBridgesFromApi } from "./bridges";
import { Vessel, parseVesselsFromApi, fetchVessels } from "./boats";
import { WS_URL } from "./config";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface DataContextValue {
  bridges: Bridge[];
  regions: Region[];
  vessels: Vessel[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  connectionStatus: ConnectionStatus;
  refetch: () => Promise<void>;
}

const RECONNECT_BASE_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 5;
const REST_POLL_INTERVAL = 30000; // 30 seconds fallback polling

// Debug logging helper - only logs in development
const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const debugError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

// Calculate exponential backoff delay with jitter
const getReconnectDelay = (attempt: number): number => {
  const baseDelay = RECONNECT_BASE_DELAY * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(baseDelay + jitter, 30000); // Cap at 30s
};

// Create context with default values
export const DataContext = createContext<DataContextValue | null>(null);

// Internal hook that manages the WebSocket connection - only used by the provider
// Not exported to prevent misuse (creating multiple connections)
function useDataInternal(): DataContextValue {
  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup function to clear all timers
  const clearTimers = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Initial data fetch and connection setup
  useEffect(() => {
    mountedRef.current = true;
    let ws: WebSocket | null = null;

    // Fetch via REST for immediate data
    const fetchData = async () => {
      try {
        if (!mountedRef.current) return;
        setError(null);

        const [bridgesData, vesselsData] = await Promise.all([
          fetchBridges(),
          fetchVessels(),
        ]);

        if (!mountedRef.current) return;

        setBridges(bridgesData);
        setRegions(groupBridgesByRegion(bridgesData));
        setVessels(vesselsData);
        setLastUpdated(new Date());
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        debugError("Failed to fetch data:", err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Start REST polling fallback
    const startPolling = () => {
      if (pollIntervalRef.current) return; // Already polling
      debugLog("[REST] Starting fallback polling");
      pollIntervalRef.current = setInterval(fetchData, REST_POLL_INTERVAL);
    };

    // Stop REST polling
    const stopPolling = () => {
      if (pollIntervalRef.current) {
        debugLog("[REST] Stopping fallback polling");
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    // Connect to WebSocket
    const connect = () => {
      if (!mountedRef.current) return;
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      setConnectionStatus("connecting");

      try {
        ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!mountedRef.current) return;
          debugLog("[WS] Connected to data updates");
          setConnectionStatus("connected");
          setError(null);
          reconnectAttemptsRef.current = 0;
          stopPolling(); // Stop REST polling when WS connects

          // Subscribe to bridges and boats channels
          try {
            ws?.send(JSON.stringify({
              action: "subscribe",
              channels: ["bridges", "boats"]
            }));
          } catch (err) {
            debugError("[WS] Failed to subscribe:", err);
          }
        };

        ws.onmessage = (event) => {
          if (!mountedRef.current) return;

          try {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
              case "subscribed":
                debugLog("[WS] Subscribed:", msg.channels);
                break;

              case "bridges":
                // Validate message structure before parsing
                if (msg.data?.bridges) {
                  const parsedBridges = parseBridgesFromApi(msg.data);
                  setBridges(parsedBridges);
                  setRegions(groupBridgesByRegion(parsedBridges));
                  setLastUpdated(new Date());
                  setLoading(false);
                }
                break;

              case "boats":
                // Validate message structure before parsing
                if (msg.data?.vessels) {
                  const parsedVessels = parseVesselsFromApi(msg.data);
                  setVessels(parsedVessels);
                  setLastUpdated(new Date());
                }
                break;
            }
          } catch (err) {
            debugError("[WS] Failed to parse message:", err);
          }
        };

        ws.onerror = () => {
          if (!mountedRef.current) return;
          debugError("[WS] Connection error");
          setConnectionStatus("error");
        };

        ws.onclose = (event) => {
          if (!mountedRef.current) return;
          debugLog("[WS] Disconnected:", event.code, event.reason);
          setConnectionStatus("disconnected");
          wsRef.current = null;

          // Attempt to reconnect with exponential backoff
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            const delay = getReconnectDelay(reconnectAttemptsRef.current);
            reconnectAttemptsRef.current++;
            debugLog(`[WS] Reconnecting in ${Math.round(delay)}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
            reconnectTimeoutRef.current = setTimeout(connect, delay);
          } else {
            debugLog("[WS] Max reconnect attempts reached, falling back to REST polling");
            setError("WebSocket disconnected, using REST fallback");
            // Start REST polling as fallback
            fetchData();
            startPolling();
          }
        };
      } catch (err) {
        if (!mountedRef.current) return;
        debugError("[WS] Failed to connect:", err);
        setConnectionStatus("error");
        fetchData();
        startPolling();
      }
    };

    // Initial fetch, then connect to WebSocket
    fetchData().then(() => {
      if (mountedRef.current) {
        connect();
      }
    });

    // Cleanup
    return () => {
      mountedRef.current = false;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Refetch function for manual refresh
  const refetch = async () => {
    if (!mountedRef.current) return;

    try {
      setError(null);
      const [bridgesData, vesselsData] = await Promise.all([
        fetchBridges(),
        fetchVessels(),
      ]);

      if (!mountedRef.current) return;

      setBridges(bridgesData);
      setRegions(groupBridgesByRegion(bridgesData));
      setVessels(vesselsData);
      setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      debugError("Failed to fetch data:", err);
    }
  };

  return {
    bridges,
    regions,
    vessels,
    loading,
    error,
    lastUpdated,
    connectionStatus,
    refetch,
  };
}

// Export for use by Providers.tsx only
export { useDataInternal };

// Hook to use data - uses shared context
export function useData(): DataContextValue {
  const context = useContext(DataContext);

  // If used outside provider, return empty state (for SSR/initial render)
  if (!context) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[useData] Called outside of DataContext.Provider. " +
        "Returning empty state. Wrap your component tree in <Providers>."
      );
    }
    return {
      bridges: [],
      regions: [],
      vessels: [],
      loading: true,
      error: null,
      lastUpdated: null,
      connectionStatus: "connecting",
      refetch: async () => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[useData] refetch called outside of DataContext.Provider - no effect");
        }
      },
    };
  }

  return context;
}
