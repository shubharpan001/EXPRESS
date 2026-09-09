import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const demoResult = (pnr: string) => ({
  pnr,
  trainNumber: "12901",
  trainName: "Gujarat Mail",
  journeyDate: "10 Sep 2026",
  from: "Ahmedabad",
  to: "Mumbai Central",
  boardingPoint: "Ahmedabad",
  class: "3A",
  passengers: [
    { number: 1, bookingStatus: "CNF", currentStatus: "CNF", coach: "B4", berth: "32 LB" },
  ],
  fare: "2,850",
  chartStatus: "Not available",
  trainStatus: "Running",
  demo: true,
});

export async function GET(request: NextRequest) {
  const pnr = request.nextUrl.searchParams.get("pnr")?.trim() || "";

  if (!/^\d{10}$/.test(pnr)) {
    return NextResponse.json({ error: "PNR must contain exactly 10 digits." }, { status: 400 });
  }

  const baseUrl = process.env.RAIL_API_BASE_URL;
  const apiKey = process.env.RAIL_API_KEY;

  // The UI can be developed without credentials, but live railway data must come
  // from an authorized provider. Never put the provider key in client-side code.
  if (!baseUrl || !apiKey) {
    return NextResponse.json(demoResult(pnr));
  }

  try {
    const endpoint = new URL(baseUrl);
    endpoint.searchParams.set("pnr", pnr);

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Railway provider returned ${response.status}. Please try again.` }, { status: 502 });
    }

    const provider = await response.json();
    const normalized = normalizeProviderResponse(provider, pnr);

    if (!normalized) {
      return NextResponse.json({ error: "The railway provider returned an unsupported PNR response format." }, { status: 502 });
    }

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json({ error: "Railway service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

function normalizeProviderResponse(data: any, pnr: string) {
  const root = data?.data ?? data?.result ?? data;
  if (!root || typeof root !== "object") return null;

  const passengers = Array.isArray(root.passengers)
    ? root.passengers.map((p: any, index: number) => ({
        number: Number(p.number ?? p.passengerNumber ?? index + 1),
        bookingStatus: String(p.bookingStatus ?? p.booking_status ?? p.bookingStatusDetails ?? "—"),
        currentStatus: String(p.currentStatus ?? p.current_status ?? p.currentStatusDetails ?? "—"),
        coach: p.coach ?? p.currentCoach ?? p.coachNumber,
        berth: p.berth ?? p.currentBerth ?? p.berthNumber,
      }))
    : [];

  return {
    pnr,
    trainNumber: String(root.trainNumber ?? root.train_number ?? root.trainNo ?? "—"),
    trainName: String(root.trainName ?? root.train_name ?? "—"),
    journeyDate: String(root.journeyDate ?? root.journey_date ?? root.dateOfJourney ?? "—"),
    from: String(root.from ?? root.source ?? root.fromStation ?? "—"),
    to: String(root.to ?? root.destination ?? root.toStation ?? "—"),
    boardingPoint: root.boardingPoint ?? root.boarding_point ?? root.boardingStation,
    class: root.class ?? root.travelClass ?? root.classCode,
    passengers,
    fare: root.fare ?? root.totalFare ?? root.total_fare,
    chartStatus: root.chartStatus ?? root.chart_status ?? root.chartPrepared,
    trainStatus: root.trainStatus ?? root.train_status ?? root.runningStatus,
    demo: false,
  };
}
