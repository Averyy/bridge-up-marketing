"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout";
import { RegionCards } from "@/components/RegionCards";
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

function BridgesContent() {
  const searchParams = useSearchParams();
  const [focusedRegion, setFocusedRegion] = useState<string | null>(null);

  // Read region from URL on mount
  useEffect(() => {
    const region = searchParams.get("region");
    if (region) {
      // Small delay to ensure map is loaded
      setTimeout(() => setFocusedRegion(region), 500);
    }
  }, [searchParams]);

  const handleRegionClick = (regionId: string) => {
    setFocusedRegion(regionId);
  };

  return (
    <>
      {/* Full-screen Map - no padding, nav floats on top */}
      <div className="absolute inset-0">
        <BridgeMap focusedRegion={focusedRegion} />
      </div>

      {/* Region cards overlay - bottom */}
      <div className="absolute bottom-6 left-0 right-0 pointer-events-none z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pointer-events-auto">
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

export default function BridgesPage() {
  return (
    <>
      <Header forceScrolled />
      <main className="h-screen w-screen bg-[var(--dark-bg)] overflow-hidden">
        <Suspense fallback={
          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-white/60">Loading map...</div>
          </div>
        }>
          <BridgesContent />
        </Suspense>
      </main>
    </>
  );
}
