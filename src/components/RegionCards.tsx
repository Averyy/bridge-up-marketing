"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useData } from "@/lib/useData";
import { Region } from "@/lib/bridges";

interface StatusStyle {
  bg: string;
  text: string;
}

// Status colors from iOS app spec
function getStatusColors(status: string, isGlass: boolean): StatusStyle {
  const colors = {
    // Open: #30D158
    open: isGlass
      ? { bg: "bg-[#30D158]/20", text: "text-[#30D158]" }
      : { bg: "bg-[#30D158]/15", text: "text-[#30D158]" },
    // Closed: #FF453A
    closed: isGlass
      ? { bg: "bg-[#FF453A]/20", text: "text-[#FF453A]" }
      : { bg: "bg-[#FF453A]/15", text: "text-[#FF453A]" },
    // Closing: #FF453A
    closing: isGlass
      ? { bg: "bg-[#FF453A]/20", text: "text-[#FF453A]" }
      : { bg: "bg-[#FF453A]/15", text: "text-[#FF453A]" },
    // Closing Soon: #30D158 (green base, like open)
    closingSoon: isGlass
      ? { bg: "bg-[#30D158]/20", text: "text-[#30D158]" }
      : { bg: "bg-[#30D158]/15", text: "text-[#30D158]" },
    // Opening: #FFD60A
    opening: isGlass
      ? { bg: "bg-[#FFD60A]/20", text: "text-[#FFD60A]" }
      : { bg: "bg-[#FFD60A]/15", text: "text-[#FFD60A]" },
    // Construction: #FF453A
    construction: isGlass
      ? { bg: "bg-[#FF453A]/20", text: "text-[#FF453A]" }
      : { bg: "bg-[#FF453A]/15", text: "text-[#FF453A]" },
    // Unknown: #98989D
    unknown: isGlass
      ? { bg: "bg-[#98989D]/20", text: "text-[#98989D]" }
      : { bg: "bg-[#98989D]/15", text: "text-[#98989D]" },
  };
  return colors[status as keyof typeof colors] || colors.unknown;
}

interface RegionCardsProps {
  variant?: "light" | "glass";
  layout?: "grid" | "masonry";
  onRegionClick?: (regionId: string) => void;
  selectedRegion?: string | null;
}

export function RegionCards({
  variant = "light",
  layout = "grid",
  onRegionClick,
  selectedRegion,
}: RegionCardsProps): React.ReactElement {
  const router = useRouter();
  const isGlass = variant === "glass";
  const isMasonry = layout === "masonry";
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const t = useTranslations("bridgeStatus");

  const { regions, loading } = useData();

  // Get translated status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "open": return t("open");
      case "closed": return t("closed");
      case "closing": return t("closing");
      case "closingSoon": return t("closingSoon");
      case "opening": return t("opening");
      case "construction": return t("construction");
      default: return t("unknown");
    }
  };

  const handleClick = (regionId: string): void => {
    if (onRegionClick) {
      onRegionClick(regionId);
    } else {
      router.push(`/bridges?region=${regionId}`);
    }
  };

  // For masonry layout: left column gets St. Catharines & Montreal, right gets the rest
  const leftColumnIds = ["st-catharines", "montreal"];
  const leftRegions = regions.filter((r) => leftColumnIds.includes(r.id));
  const rightRegions = regions.filter((r) => !leftColumnIds.includes(r.id));

  const renderCard = (area: Region, i: number): React.ReactElement => {
    const isSelected = selectedRegion === area.id;
    const isHovered = hoveredCard === area.id;

    const cardClasses = isGlass
      ? `bg-black/60 backdrop-blur-xl border hover:bg-black/70 ${isSelected ? "border-[var(--primary)] bg-black/70" : "border-white/10"}`
      : "bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[var(--primary)]/20";

    const titleClasses = isGlass ? "text-white" : "text-[var(--foreground)]";
    const textClasses = isGlass ? "text-white/80" : "text-gray-600";
    const badgeBgClasses = isGlass
      ? "bg-white/20 text-white"
      : "bg-[var(--primary)]/10 text-[var(--primary)]";

    return (
      <div
        key={area.id}
        className="animate-fade-in-up pointer-events-auto"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <button
          onClick={() => handleClick(area.id)}
          onMouseEnter={() => setHoveredCard(area.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className={`relative rounded-2xl p-5 overflow-hidden block w-full text-left cursor-pointer duration-300 ease-out ${cardClasses}`}
          style={{
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            transition:
              "transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out, background-color 0.3s ease-out",
          }}
        >
          {/* Hover glow effect */}
          <div
            className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
            style={{
              backgroundColor: area.glowColor,
              opacity: isHovered ? 0.4 : 0,
              transform: "translateZ(0)",
            }}
          />

          <div className="relative flex items-center justify-between mb-4">
            <h3 className={`font-bold ${titleClasses}`}>{area.region}</h3>
            <span
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${badgeBgClasses}`}
            >
              {area.bridges.length}
            </span>
          </div>
          <ul className="relative space-y-2">
            {area.bridges.map((bridge, j) => {
              const statusColors = getStatusColors(bridge.status, isGlass);
              return (
                <li
                  key={j}
                  className={`flex items-center justify-between gap-2 text-sm ${textClasses}`}
                >
                  <span className="truncate min-w-0">{bridge.name}</span>
                  <span
                    className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${statusColors.bg} ${statusColors.text}`}
                  >
                    {getStatusLabel(bridge.status)}
                  </span>
                </li>
              );
            })}
          </ul>
        </button>
      </div>
    );
  };

  // Loading skeleton
  const renderSkeleton = (count: number): React.ReactElement[] => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`rounded-2xl p-5 animate-pulse ${
          isGlass ? "bg-white/10" : "bg-gray-100"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`h-5 w-24 rounded ${isGlass ? "bg-white/20" : "bg-gray-200"}`}
          />
          <div
            className={`h-6 w-8 rounded-full ${isGlass ? "bg-white/20" : "bg-gray-200"}`}
          />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="flex items-center justify-between gap-2">
              <div
                className={`h-4 w-20 rounded ${isGlass ? "bg-white/20" : "bg-gray-200"}`}
              />
              <div
                className={`h-4 w-12 rounded ${isGlass ? "bg-white/20" : "bg-gray-200"}`}
              />
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Show loading skeleton while data loads
  if (loading || regions.length === 0) {
    if (isMasonry) {
      return (
        <>
          {/* Tablet: Masonry 2-column layout */}
          <div className="grid md:grid-cols-2 gap-4 lg:hidden">
            <div className="space-y-4">{renderSkeleton(2)}</div>
            <div className="space-y-4">{renderSkeleton(3)}</div>
          </div>
          {/* Desktop: All 5 side by side */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4">
            {renderSkeleton(5)}
          </div>
        </>
      );
    }

    return (
      <div
        className={`grid sm:grid-cols-2 lg:grid-cols-5 gap-4 ${isGlass ? "items-end" : ""}`}
      >
        {renderSkeleton(5)}
      </div>
    );
  }

  // Masonry layout: 2 columns on tablet, 5 columns on desktop
  if (isMasonry) {
    return (
      <>
        {/* Tablet: Masonry 2-column layout */}
        <div className="grid md:grid-cols-2 gap-4 lg:hidden">
          {/* Left Column - St. Catharines & Montreal */}
          <div className="space-y-4">
            {leftRegions.map((area, i) => renderCard(area, i))}
          </div>
          {/* Right Column - Port Colborne, Beauharnois, Kahnawake */}
          <div className="space-y-4">
            {rightRegions.map((area, i) =>
              renderCard(area, i + leftRegions.length)
            )}
          </div>
        </div>
        {/* Desktop: All 5 side by side */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4">
          {regions.map((area, i) => renderCard(area, i))}
        </div>
      </>
    );
  }

  // Default grid layout
  return (
    <div
      className={`grid sm:grid-cols-2 lg:grid-cols-5 gap-4 ${isGlass ? "items-end" : ""}`}
    >
      {regions.map((area, i) => renderCard(area, i))}
    </div>
  );
}
