"use client";

// Client island — the ONLY live part of an otherwise server-rendered bridge page.
// Reads the app-wide DataContext (same WebSocket the map uses). Before hydration
// (and during the first load) it renders a neutral placeholder, so a stale status
// is never baked into the daily-cached HTML the crawler sees.
import { useTranslations } from "next-intl";
import { useData } from "@/lib/useData";
import { BridgeStatusIcon, getStatusIconColor } from "@/components/ui/BridgeStatusIcon";
import { getTranslatedStatusInfoText } from "@/lib/bridges";

interface Props {
  apiId: string;
  iconSize?: number;
  className?: string;
}

export function LiveStatus({
  apiId,
  iconSize = 32,
  className = "",
}: Props): React.ReactElement {
  const t = useTranslations("bridgeStatus");
  const { bridges, loading } = useData();
  const bridge = bridges.find((b) => b.id === apiId);

  if (!bridge) {
    const text = loading ? t("checking") : t("statusUnknown");
    return (
      <div className={`flex min-h-[2.75rem] items-center gap-3 ${className}`}>
        <span
          className="inline-block flex-shrink-0 rounded-full bg-white/25"
          style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
          aria-hidden
        />
        <span className="text-sm text-white/50">{text}</span>
      </div>
    );
  }

  const color = getStatusIconColor(bridge.status);
  const label = t(bridge.status);
  const info = getTranslatedStatusInfoText(
    t,
    bridge.status,
    bridge.prediction,
    bridge.lastUpdated,
    bridge.upcomingClosure
  );

  return (
    <div className={`flex min-h-[2.75rem] items-center gap-3 ${className}`}>
      <BridgeStatusIcon status={bridge.status} size={iconSize} />
      <div className="min-w-0">
        <div className="text-lg font-semibold leading-tight" style={{ color }}>
          {label}
        </div>
        <div className="text-sm text-white/70">{info}</div>
      </div>
    </div>
  );
}
