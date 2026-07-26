import { NextRequest, NextResponse } from "next/server";

// Mock flight data for MVP. Real RapidAPI integration requires placeId lookup.
function getMockFlights(departureDate: string) {
  const basePrice = 520;
  const priceVariance = Math.sin(new Date(departureDate).getTime() / 100000000) * 80;

  return {
    data: [
      {
        price: Math.round(basePrice + priceVariance),
        airline: "Delta",
        stops: 0,
        duration: "4h 30m",
      },
      {
        price: Math.round(basePrice - 20 + priceVariance),
        airline: "Southwest",
        stops: 0,
        duration: "4h 45m",
      },
      {
        price: Math.round(basePrice + 60 + priceVariance),
        airline: "United",
        stops: 1,
        duration: "6h 15m",
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const departureDate = searchParams.get("departureDate");

  if (!departureDate) {
    return NextResponse.json({ error: "departureDate required" }, { status: 400 });
  }

  return NextResponse.json(getMockFlights(departureDate));
}
