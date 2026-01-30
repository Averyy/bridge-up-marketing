"use client";

import { ReactNode } from "react";
import { DataContext, useDataInternal } from "@/lib/useData";

export function Providers({ children }: { children: ReactNode }): React.ReactElement {
  const dataValue = useDataInternal();

  return (
    <DataContext.Provider value={dataValue}>
      {children}
    </DataContext.Provider>
  );
}
