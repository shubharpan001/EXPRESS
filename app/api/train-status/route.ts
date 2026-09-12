import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10000;

// Demo fallback data for local development when DEMO_MODE=true
const demoResult = (trainNumber: string) => ({
  trainNumber,
  trainName: "Mumbai Rajdhani Express",
  status: "running",
  delayMinutes: 18,
  currentStation: "Kota Junction",
  nextStation: "Ratlam Junction",
  source: { code: "NDLS", name: "New Delhi" },
  destination: { code: "MMCT", name: "Mumbai Central" },
  lastUpdatedAt: new Date().toISOString(),
  route: [
    { sequence: 1, stationCode: "NDLS", stationName: "New Delhi", scheduledDeparture: "16:55", status: "departed", delayDeparture: 0 },
    { sequence: 2, stationCode: "KOTA", stationName: "Kota Junction", scheduledArrival: "23:10", status: "current", delayArrival: 18 },
    { sequence: 3, stationCode: "RTM", stationName: "Ratlam Junction", scheduledArrival: "02:15", status: "upcoming", delayArrival: null },
    { sequence: 4, stationCode: "MMCT", stationName: "Mumbai Central", scheduledArrival: "08:35", status: "upcoming", delayArrival: null },
  ],
  demo: true,
});

export async function GET(request: NextRequest) {
  const trainNumber = request.nextUrl.searchParams.get("train")?.trim() || "";
  const date = request.nextUrl.searchParams.get("date")?.trim() || "";

  // Input validation
  if (!/^\d{4,5}$/.test(trainNumber)) {
    return NextResponse.json(
      { error: "Train number must be 4 or 5 digits." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RAILRADAR_API_KEY;
  const baseUrl = process.env.RAILRADAR_API_BASE_URL || "https://api.railradar.in/v1";
  const demoMode = process.env.DEMO_MODE === "true";

  // Use demo mode if explicitly enabled or API key is missing
  if (demoMode || !apiKey) {
    return NextResponse.json(demoResult(trainNumber));
  }

  try {
    const url = new URL(`${baseUrl}/trains/${encodeURIComponent(trainNumber)}/live`);
    if (date) url.searchParams.set("date", date);

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
        { error: `Train ${trainNumber} not found. Please check the train number and try again.` },
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
        { error: "Unable to fetch train status. Please try again." },
        { status: 502 }
      );
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      return NextResponse.json(
        { error: json.error?.message || "No data returned for this train." },
        { status: 404 }
      );
    }

    const data = json.data;
    const normalized = {
      trainNumber: data.trainNumber,
      trainName: data.trainName,
      status: data.status,
      delayMinutes: data.delayMinutes ?? 0,
      currentStation: data.currentLocation?.stationCode
        ? (data.route?.find((s: any) => s.stationCode === data.currentLocation.stationCode)?.stationName ?? data.currentLocation.stationCode)
        : null,
      nextStation: data.nextHalt?.stationName ?? null,
      source: data.train?.source ?? null,
      destination: data.train?.destination ?? null,
      lastUpdatedAt: data.lastUpdatedAt,
      route: Array.isArray(data.route)
        ? data.route.map((stop: any) => ({
            sequence: stop.sequence,
            stationCode: stop.stationCode,
            stationName: stop.stationName,
            scheduledArrival: stop.scheduledArrival,
            scheduledDeparture: stop.scheduledDeparture,
            actualArrival: stop.actualArrival,
            actualDeparture: stop.actualDeparture,
            delayArrival: stop.delayArrival,
            delayDeparture: stop.delayDeparture,
            status: stop.status,
            platform: stop.platform ?? null,
          }))
        : [],
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
