"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout";
import { RegionCards } from "@/components/RegionCards";
import { useBridges } from "@/lib/useBridges";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const BridgeMap = dynamic(() => import("@/components/BridgeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

function BridgesMapContent() {
  const searchParams = useSearchParams();
  const [focusedRegion, setFocusedRegion] = useState<string | null>(null);
  const { regions, loading } = useBridges();

  // Read region from URL on mount
  useEffect(() => {
    const region = searchParams.get("region");
    if (region) {
      // Small delay to ensure map is loaded
      setTimeout(() => setFocusedRegion(region), 500);
    }
  }, [searchParams]);

  const handleRegionClick = (regionId: string): void => {
    // Toggle selection - clicking same region deselects
    setFocusedRegion((prev) => (prev === regionId ? null : regionId));
  };

  const handleRegionClear = (): void => {
    setFocusedRegion(null);
  };

  return (
    <>
      {/* Full-screen Map - no padding, nav floats on top */}
      <div className="absolute inset-0">
        <BridgeMap focusedRegion={focusedRegion} onRegionClear={handleRegionClear} />
      </div>

      {/* Mobile/Tablet: Region tags - horizontal scroll */}
      <div className="absolute bottom-6 left-0 right-0 pointer-events-none z-10 lg:hidden">
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
            {loading ? (
              // Loading skeleton for region pills
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-4 py-2.5 rounded-full bg-white/10 animate-pulse"
                  style={{ width: "120px", height: "40px" }}
                />
              ))
            ) : (
              regions.map((area) => {
                const isSelected = focusedRegion === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => handleRegionClick(area.id)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all backdrop-blur-xl border pointer-events-auto ${
                      isSelected
                        ? "bg-white/30 border-white/50 text-white"
                        : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                    }`}
                    style={{
                      boxShadow: isSelected
                        ? `0 0 20px ${area.glowColor}40`
                        : undefined,
                    }}
                  >
                    {area.region}
                    <span
                      className={`ml-2 text-xs ${isSelected ? "text-white/80" : "text-white/60"}`}
                    >
                      {area.bridges.length}
                    </span>
                  </button>
                );
              })
            )}
            {/* Spacer for scroll padding on right */}
            <div className="flex-shrink-0 w-2" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Desktop: Full region cards overlay - bottom */}
      <div className="absolute bottom-6 left-0 right-0 pointer-events-none z-10 px-4 lg:px-8 hidden lg:block">
        <div className="max-w-6xl mx-auto">
          <RegionCards
            variant="glass"
            onRegionClick={handleRegionClick}
            selectedRegion={focusedRegion}
          />
        </div>
      </div>
    </>
  );
}

export default function BridgesContent() {
  const t = useTranslations("bridges");

  return (
    <>
      <Header forceScrolled />
      <main className="fixed inset-0 bg-[var(--dark-bg)] overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
              <div className="text-white/60">{t("loadingMap")}</div>
            </div>
          }
        >
          <BridgesMapContent />
        </Suspense>
      </main>
    </>
  );
}
