"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBridges } from "@/lib/useBridges";
import { Region } from "@/lib/bridges";

interface StatusStyle {
  bg: string;
  text: string;
  label: string;
}

function getStatusStyle(status: string): StatusStyle {
  switch (status) {
    case "open":
      return { bg: "bg-green-500/15", text: "text-green-600", label: "Open" };
    case "closed":
      return { bg: "bg-red-500/15", text: "text-red-600", label: "Closed" };
    case "closing":
      return { bg: "bg-red-500/15", text: "text-red-600", label: "Closing" };
    case "closingSoon":
      return { bg: "bg-amber-500/15", text: "text-amber-600", label: "Closing Soon" };
    case "opening":
      return { bg: "bg-yellow-500/15", text: "text-yellow-600", label: "Opening" };
    case "construction":
      return { bg: "bg-red-500/15", text: "text-red-600", label: "Work" };
    default:
      return { bg: "bg-gray-500/15", text: "text-gray-600", label: "Unknown" };
  }
}

function getStatusStyleGlass(status: string): StatusStyle {
  switch (status) {
    case "open":
      return { bg: "bg-green-500/20", text: "text-green-400", label: "Open" };
    case "closed":
      return { bg: "bg-red-500/20", text: "text-red-400", label: "Closed" };
    case "closing":
      return { bg: "bg-red-500/20", text: "text-red-400", label: "Closing" };
    case "closingSoon":
      return { bg: "bg-amber-500/20", text: "text-amber-400", label: "Closing Soon" };
    case "opening":
      return { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Opening" };
    case "construction":
      return { bg: "bg-red-500/20", text: "text-red-400", label: "Work" };
    default:
      return { bg: "bg-gray-500/20", text: "text-gray-400", label: "Unknown" };
  }
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

  const { regions, loading } = useBridges();

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
        className="animate-fade-in-up"
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
              const statusStyle = isGlass
                ? getStatusStyleGlass(bridge.status)
                : getStatusStyle(bridge.status);
              return (
                <li
                  key={j}
                  className={`flex items-center justify-between gap-2 text-sm ${textClasses}`}
                >
                  <span className="truncate min-w-0">{bridge.name}</span>
                  <span
                    className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
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
