// Server component — renders the per-bridge closure-duration histogram as
// horizontal bars. Mirrors the iOS BridgeDetailView chart: percentages are
// computed over the BUCKET SUM (not total_entries), colors run green→red.
import { RawClosureDurations, closureDurationsTotal } from "@/lib/bridgeStats";

// Fixed bucket order, colors match the iOS app (green, green, teal, orange, red).
const BUCKETS: { key: keyof RawClosureDurations; color: string }[] = [
  { key: "under_9m", color: "#30D158" },
  { key: "10_15m", color: "#30D158" },
  { key: "16_30m", color: "#30B0C7" },
  { key: "31_60m", color: "#FF9F0A" },
  { key: "over_60m", color: "#FF453A" },
];

interface Props {
  durations: RawClosureDurations;
  // Five labels in bucket order (1–9m … 60m+); caller supplies them localized.
  labels: [string, string, string, string, string];
}

export function ClosureDurationsChart({ durations, labels }: Props): React.ReactElement {
  const total = closureDurationsTotal(durations);
  // Convey the actual distribution (label + percentage) to screen readers, not
  // just the axis labels.
  const summary = BUCKETS.map(
    (b, i) => `${labels[i]}: ${Math.round(total > 0 ? (durations[b.key] / total) * 100 : 0)}%`
  ).join(", ");

  return (
    <div className="flex flex-col gap-2.5" role="img" aria-label={summary}>
      {BUCKETS.map((bucket, i) => {
        const value = durations[bucket.key];
        const pct = total > 0 ? (value / total) * 100 : 0;
        return (
          <div key={bucket.key} className="flex items-center gap-3 text-sm">
            <span className="w-20 flex-shrink-0 whitespace-nowrap tabular-nums text-white/70">
              {labels[i]}
            </span>
            <div className="relative h-4 flex-1 overflow-hidden rounded bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded"
                style={{ width: `${pct}%`, backgroundColor: bucket.color }}
              />
            </div>
            <span className="w-10 flex-shrink-0 text-right font-medium tabular-nums text-white/80">
              {Math.round(pct)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
