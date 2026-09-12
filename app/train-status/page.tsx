"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  TrainFront,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import styles from "./train-status.module.css";

interface RouteStop {
  sequence: number;
  stationCode: string;
  stationName: string;
  scheduledArrival?: string | null;
  scheduledDeparture?: string | null;
  actualArrival?: string | null;
  actualDeparture?: string | null;
  delayArrival?: number | null;
  delayDeparture?: number | null;
  status: "departed" | "current" | "upcoming" | string;
  platform?: string | null;
}

interface TrainStatusResult {
  trainNumber: string;
  trainName: string;
  status: string;
  delayMinutes: number;
  currentStation: string | null;
  nextStation: string | null;
  source?: { code: string; name: string } | null;
  destination?: { code: string; name: string } | null;
  lastUpdatedAt?: string | null;
  route: RouteStop[];
  demo?: boolean;
}

function formatTime(iso?: string | null): string {
  if (!iso) return "—";
  // If it's already a short time string like "16:55", return as-is
  if (/^\d{2}:\d{2}$/.test(iso)) return iso;
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  } catch {
    return iso;
  }
}

function delayLabel(minutes?: number | null): string {
  if (minutes == null) return "—";
  if (minutes === 0) return "On time";
  if (minutes > 0) return `${minutes} min late`;
  return `${Math.abs(minutes)} min early`;
}

export default function TrainStatusPage() {
  const [trainNumber, setTrainNumber] = useState("");
  const [result, setResult] = useState<TrainStatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState("");

  async function fetchStatus(number: string) {
    setLoading(true);
    setError("");
    setResult(null);
    setLastSearched(number);

    try {
      const response = await fetch(`/api/train-status?train=${encodeURIComponent(number)}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Unable to fetch train status. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function checkStatus(event: React.FormEvent) {
    event.preventDefault();
    const value = trainNumber.trim();
    if (!/^\d{4,5}$/.test(value)) {
      setError("Enter a valid 4 or 5 digit train number.");
      setResult(null);
      return;
    }
    fetchStatus(value);
  }

  function refreshStatus() {
    if (lastSearched) fetchStatus(lastSearched);
  }

  const stopStateClass = (status: string): "departed" | "current" | "upcoming" => {
    if (status === "departed") return "departed";
    if (status === "current") return "current";
    return "upcoming";
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}><ArrowLeft size={18} /> Home</Link>
          <div className={styles.logo}><span><TrainFront size={19} /></span><strong>EXPRESS</strong></div>
          <div className={styles.secure}><ShieldCheck size={15} /> Private</div>
        </header>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>TRAIN JOURNEY</p>
          <h1>Live Train Status</h1>
          <p>Check where your train is, its next stop and expected arrival.</p>

          <form className={styles.searchBox} onSubmit={checkStatus}>
            <Search size={20} />
            <input
              inputMode="numeric"
              maxLength={5}
              value={trainNumber}
              onChange={(event) => { setTrainNumber(event.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="Enter train number (e.g. 12951)"
              aria-label="Train number"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Check Status"} <ArrowRight size={17} />
            </button>
          </form>
          {error && <p className={styles.error}><AlertCircle size={15} /> {error}</p>}
        </section>

        {loading && (
          <section className={styles.statusCard}>
            <div className={styles.loadingState}>
              <RefreshCw size={22} className={styles.spin} />
              <strong>Fetching latest train status...</strong>
              <span>Please wait a moment.</span>
            </div>
          </section>
        )}

        {!loading && result && (
          <>
            <section className={styles.statusCard}>
              <div className={styles.statusTop}>
                <div>
                  <div className={styles.trainNo}>{result.trainNumber} <span>{result.trainName}</span></div>
                  <div className={styles.route}>
                    {result.source?.name ?? "—"} <ArrowRight size={17} /> {result.destination?.name ?? "—"}
                  </div>
                </div>
                <span className={styles.delay}>
                  <Clock3 size={14} /> {delayLabel(result.delayMinutes)}
                </span>
              </div>

              {(result.currentStation || result.nextStation) && (
                <div className={styles.currentBox}>
                  <div className={styles.currentIcon}><MapPin size={21} /></div>
                  <div>
                    <small>Currently at</small>
                    <strong>{result.currentStation ?? "—"}</strong>
                    {result.nextStation && <span>Next stop: {result.nextStation}</span>}
                  </div>
                  {result.lastUpdatedAt && (
                    <div className={styles.updated}>
                      Updated<br />
                      <b>{formatTime(result.lastUpdatedAt)}</b>
                    </div>
                  )}
                </div>
              )}

              {result.route.length > 0 && (
                <div className={styles.timeline}>
                  {result.route.map((stop) => {
                    const stateClass = stopStateClass(stop.status);
                    const displayTime = formatTime(stop.actualDeparture ?? stop.scheduledDeparture ?? stop.actualArrival ?? stop.scheduledArrival);
                    const delay = stop.status === "departed"
                      ? delayLabel(stop.delayDeparture ?? stop.delayArrival)
                      : stop.status === "upcoming"
                      ? (stop.delayArrival != null ? `Expected ${delayLabel(stop.delayArrival)}` : "Upcoming")
                      : delayLabel(stop.delayArrival ?? stop.delayDeparture);

                    return (
                      <div className={`${styles.stop} ${styles[stateClass]}`} key={`${stop.stationCode}-${stop.sequence}`}>
                        <div className={styles.dot}>
                          {stateClass === "departed" && <CheckCircle2 size={15} />}
                        </div>
                        <div className={styles.stopInfo}>
                          <strong>{stop.stationName}</strong>
                          <span>{stop.stationCode} · {displayTime}</span>
                          <small>{delay}</small>
                          {stop.platform && <small>Platform {stop.platform}</small>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button type="button" className={styles.refreshButton} onClick={refreshStatus}>
                <RefreshCw size={15} /> Refresh status
              </button>
            </section>

            <section className={styles.infoGrid}>
              <div>
                <small>From</small>
                <strong>{result.source?.name ?? "—"}</strong>
                <span>{result.source?.code ?? ""}</span>
              </div>
              <div>
                <small>To</small>
                <strong>{result.destination?.name ?? "—"}</strong>
                <span>{result.destination?.code ?? ""}</span>
              </div>
              <div>
                <small>Running status</small>
                <strong>{delayLabel(result.delayMinutes)}</strong>
                <span>{result.status}</span>
              </div>
            </section>

            {result.demo && (
              <div className={styles.demoNote}>
                <ShieldCheck size={18} />
                <div>
                  <strong>Demo mode active</strong>
                  <p>Set RAILRADAR_API_KEY in your server environment to enable live railway data from RailRadar.</p>
                </div>
              </div>
            )}
          </>
        )}

        <footer>
          <Link href="/pnr">Check PNR</Link>
          <span>·</span>
          <span>EXPRESS · Real-World Social Friends</span>
        </footer>
      </div>
    </main>
  );
}
