"use client";

import { ReactNode } from "react";
import { BridgesContext, useBridgesInternal } from "@/lib/useBridges";

export function Providers({ children }: { children: ReactNode }): React.ReactElement {
  const bridgesValue = useBridgesInternal();

  return (
    <BridgesContext.Provider value={bridgesValue}>
      {children}
    </BridgesContext.Provider>
  );
}
