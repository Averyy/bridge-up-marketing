"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Bridge data with status - this would come from an API in production
export const regions = [
  {
    id: "st-catharines",
    region: "St. Catharines",
    glowColor: "#22c55e",
    bridges: [
      { name: "Highway 20", status: "open" },
      { name: "Glendale Ave", status: "open" },
      { name: "Queenston St", status: "closed" },
      { name: "Lakeshore Rd", status: "open" },
      { name: "Carlton St", status: "open" },
    ],
  },
  {
    id: "port-colborne",
    region: "Port Colborne",
    glowColor: "#3b82f6",
    bridges: [
      { name: "Clarence St", status: "open" },
      { name: "Main St", status: "closing" },
      { name: "Mellanby Ave", status: "open" },
    ],
  },
  {
    id: "montreal",
    region: "Montreal",
    glowColor: "#8b5cf6",
    bridges: [
      { name: "Ste-Catherine", status: "open" },
      { name: "Victoria Downstream", status: "open" },
      { name: "Victoria Upstream", status: "open" },
    ],
  },
  {
    id: "beauharnois",
    region: "Beauharnois",
    glowColor: "#f97316",
    bridges: [
      { name: "Larocque Bridge", status: "open" },
      { name: "St-Louis-de-Gonzague", status: "open" },
    ],
  },
  {
    id: "kahnawake",
    region: "Kahnawake",
    glowColor: "#ec4899",
    bridges: [
      { name: "CP Railway Bridge 7A", status: "open" },
      { name: "CP Railway Bridge 7B", status: "open" },
    ],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "bg-green-500";
    case "closed":
      return "bg-red-500";
    case "closing":
      return "bg-amber-500";
    default:
      return "bg-gray-500";
  }
}

interface RegionCardsProps {
  variant?: "light" | "glass";
  layout?: "grid" | "masonry";
  onRegionClick?: (regionId: string) => void;
  selectedRegion?: string | null;
}

export function RegionCards({ variant = "light", layout = "grid", onRegionClick, selectedRegion }: RegionCardsProps) {
  const router = useRouter();
  const isGlass = variant === "glass";
  const isMasonry = layout === "masonry";
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleClick = (regionId: string) => {
    if (onRegionClick) {
      onRegionClick(regionId);
    } else {
      router.push(`/bridges?region=${regionId}`);
    }
  };

  // For masonry layout: left column gets St. Catharines & Montreal, right gets the rest
  const leftColumnIds = ["st-catharines", "montreal"];
  const leftRegions = regions.filter(r => leftColumnIds.includes(r.id));
  const rightRegions = regions.filter(r => !leftColumnIds.includes(r.id));

  const renderCard = (area: typeof regions[0], i: number) => {
    const isSelected = selectedRegion === area.id;
    const isHovered = hoveredCard === area.id;

    const cardClasses = isGlass
      ? `bg-white/10 backdrop-blur-xl border hover:bg-white/15 ${isSelected ? "border-white/50 bg-white/20" : "border-white/20"}`
      : "bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[var(--primary)]/20";

    const titleClasses = isGlass ? "text-white" : "text-[var(--foreground)]";
    const textClasses = isGlass ? "text-white/80" : "text-gray-600";
    const badgeBgClasses = isGlass ? "bg-white/20 text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]";

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
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out, background-color 0.3s ease-out',
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
            <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${badgeBgClasses}`}>
              {area.bridges.length}
            </span>
          </div>
          <ul className="relative space-y-2">
            {area.bridges.map((bridge, j) => (
              <li key={j} className={`flex items-center gap-2.5 text-sm ${textClasses}`}>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(bridge.status)}`} />
                {bridge.name}
              </li>
            ))}
          </ul>
        </button>
      </div>
    );
  };

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
            {rightRegions.map((area, i) => renderCard(area, i + leftRegions.length))}
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
    <div className={`grid sm:grid-cols-2 lg:grid-cols-5 gap-4 ${isGlass ? "items-end" : ""}`}>
      {regions.map((area, i) => renderCard(area, i))}
    </div>
  );
}
