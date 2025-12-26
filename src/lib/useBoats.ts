"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Vessel, fetchVessels } from "./boats";

export interface BoatsState {
  vessels: Vessel[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

const REFETCH_INTERVAL = 60000; // 60 seconds - boats move slowly

export function useBoats(enabled: boolean = true): BoatsState {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Only fetch if tab is visible
    if (document.hidden) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchVessels();
      setVessels(data);
      setLastUpdated(new Date());
      hasFetchedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vessels");
      console.error("Failed to fetch vessels:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  // Initial fetch and periodic refetch
  useEffect(() => {
    if (!enabled) {
      // Clear vessels and reset state when disabled
      setVessels([]);
      hasFetchedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchData();

    // Set up periodic refetch
    intervalRef.current = setInterval(fetchData, REFETCH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, fetchData]);

  // Handle visibility changes - fetch when tab becomes visible if stale
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && hasFetchedRef.current) {
        // Tab became visible, check if data is stale (older than interval)
        const now = new Date();
        if (lastUpdated && now.getTime() - lastUpdated.getTime() > REFETCH_INTERVAL) {
          fetchData();
        }
      } else if (!document.hidden && !hasFetchedRef.current) {
        // Tab visible but never fetched - do initial fetch
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, lastUpdated, fetchData]);

  return {
    vessels,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}
