import { NextRequest, NextResponse } from "next/server";

// Flights Scraper Sky API on RapidAPI
// Endpoint: GET web/flights/details
// Required params: departureDate, returnDate, origin, destination

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const origin = searchParams.get("origin") || "AUS"; // Austin
  const destination = searchParams.get("destination") || "DTW"; // Detroit

  if (!departureDate || !returnDate) {
    return NextResponse.json(
      { error: "departureDate and returnDate required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Flight API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://flights-sky.p.rapidapi.com/web/flights/details?` +
        new URLSearchParams({
          departureDate,
          returnDate,
          origin,
          destination,
        }),
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "flights-sky.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Flight API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    );
  }
}
