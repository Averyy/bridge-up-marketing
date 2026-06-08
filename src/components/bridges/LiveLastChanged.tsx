"use client";

// Tiny client island: the live "status changed" time, for the 3rd stat tile.
import { useData } from "@/lib/useData";
import { formatLastUpdated } from "@/lib/bridges";

export function LiveLastChanged({ apiId }: { apiId: string }): React.ReactElement {
  const { bridges, loading } = useData();
  const bridge = bridges.find((b) => b.id === apiId);
  if (!bridge) return <span className="text-white/40">{loading ? "…" : "–"}</span>;
  return <span>{formatLastUpdated(bridge.lastUpdated)}</span>;
}
