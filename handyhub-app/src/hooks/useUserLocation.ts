"use client";

import { useState, useCallback } from "react";

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

interface UseUserLocationReturn {
  getUserLocation: () => Promise<void>;
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  isPermissionDenied: boolean;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPermissionDenied(false);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // 5 min cache
          });
        }
      );

      const { latitude: lat, longitude: lng } = position.coords;

      // Reverse geocode via our API (which uses Google Geocoding)
      // Fall back to coordinates-only if it fails
      let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        const res = await fetch(
          `/api/contractors/search?lat=${lat}&lng=${lng}&limit=0`
        );
        if (res.ok) {
          // Use the center as confirmation, but we need a display address
          // Try the Google geocoding endpoint via server
          const geoRes = await fetch(
            `/api/geocode?lat=${lat}&lng=${lng}`
          );
          if (geoRes.ok) {
            const geo = await geoRes.json();
            if (geo.address) address = geo.address;
          }
        }
      } catch {
        // Fallback to coordinate string — still usable
      }

      setLocation({ lat, lng, address });
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setIsPermissionDenied(true);
        setError("Location access denied. Please enter your address manually.");
      } else if (geoError.code === geoError.TIMEOUT) {
        setError("Location request timed out. Please try again.");
      } else {
        setError("Unable to determine your location.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getUserLocation, location, isLoading, error, isPermissionDenied };
}
