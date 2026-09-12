import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10000;

// Demo fallback data for local development when DEMO_MODE=true
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
  chartStatus: "Chart Not Prepared",
  trainStatus: "Running",
  demo: true,
});

export async function GET(request: NextRequest) {
  const pnr = request.nextUrl.searchParams.get("pnr")?.trim() || "";

  // Input validation
  if (!/^\d{10}$/.test(pnr)) {
    return NextResponse.json(
      { error: "PNR must contain exactly 10 digits." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RAILRADAR_API_KEY;
  const baseUrl = process.env.RAILRADAR_API_BASE_URL || "https://api.railradar.in/v1";
  const demoMode = process.env.DEMO_MODE === "true";

  // Use demo mode if explicitly enabled or API key is missing
  if (demoMode || !apiKey) {
    return NextResponse.json(demoResult(pnr));
  }

  try {
    const url = new URL(`${baseUrl}/pnr/${encodeURIComponent(pnr)}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 401) {
      return NextResponse.json(
        { error: "Railway service authentication failed. Please contact support." },
        { status: 502 }
      );
    }

    if (response.status === 404) {
      return NextResponse.json(
        { error: "PNR not found. Please check the number and try again." },
        { status: 404 }
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (response.status === 503) {
      return NextResponse.json(
        { error: "Railway data service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch PNR status. Please try again." },
        { status: 502 }
      );
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      return NextResponse.json(
        { error: json.error?.message || "No data returned for this PNR." },
        { status: 404 }
      );
    }

    const data = json.data;
    const passengers = Array.isArray(data.passengers)
      ? data.passengers.map((p: any, index: number) => ({
          number: Number(p.passengerNumber ?? p.number ?? index + 1),
          bookingStatus: String(p.bookingStatus ?? "—"),
          currentStatus: String(p.currentStatus ?? "—"),
          coach: p.coach ?? null,
          berth: p.berthNumber != null ? String(p.berthNumber) + (p.berthCode ? ` ${p.berthCode}` : "") : null,
        }))
      : [];

    const normalized = {
      pnr,
      trainNumber: String(data.train?.number ?? "—"),
      trainName: String(data.train?.name ?? "—"),
      journeyDate: String(data.journey?.date ?? "—"),
      from: String(data.train?.source?.name ?? "—"),
      to: String(data.train?.destination?.name ?? "—"),
      boardingPoint: data.train?.boardingPoint?.name ?? null,
      class: data.journey?.class ?? null,
      passengers,
      fare: data.journey?.bookingFare ?? null,
      chartStatus: data.charting?.status ?? null,
      trainStatus: null,
      demo: false,
    };

    return NextResponse.json(normalized);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Railway service is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }
}
