"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

export interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
  city: string | null;
  state: string | null;
  zip: string | null;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  defaultValue?: string;
  onPlaceSelect: (place: PlaceResult) => void;
  className?: string;
}

export function AddressAutocomplete({
  placeholder = "Enter your address or zip code...",
  defaultValue = "",
  onPlaceSelect,
  className = "",
}: AddressAutocompleteProps) {
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    autocompleteRef.current = new places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry", "address_components"],
      types: ["geocode"],
    });

    const listener = autocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry?.location) return;

        const result: PlaceResult = {
          address: place.formatted_address ?? "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          city: extractComponent(place, "locality"),
          state: extractComponent(
            place,
            "administrative_area_level_1",
            true
          ),
          zip: extractComponent(place, "postal_code"),
        };

        setValue(result.address);
        onPlaceSelect(result);
      }
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [places, onPlaceSelect]);

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function extractComponent(
  place: google.maps.places.PlaceResult,
  type: string,
  shortName = false
): string | null {
  const comp = place.address_components?.find((c) => c.types.includes(type));
  return comp ? (shortName ? comp.short_name : comp.long_name) : null;
}
