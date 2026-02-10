import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/geocoding";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const lat = parseFloat(params.get("lat") ?? "");
  const lng = parseFloat(params.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Provide valid lat and lng" },
      { status: 400 }
    );
  }

  const result = await reverseGeocode(lat, lng);

  if (!result) {
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 502 }
    );
  }

  return NextResponse.json(result);
}
