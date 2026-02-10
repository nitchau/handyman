"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

export function MapProvider({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_CONFIG.apiKey}>{children}</APIProvider>
  );
}
