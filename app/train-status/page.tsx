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

type Train = {
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  delay: string;
  current: string;
  next: string;
  updated: string;
  stops: { name: string; code: string; time: string; state: "departed" | "current" | "upcoming"; delay: string }[];
};

const trains: Record<string, Train> = {
  "12951": {
    number: "12951",
    name: "Mumbai Rajdhani Express",
    from: "New Delhi",
    to: "Mumbai Central",
    departure: "16:55",
    arrival: "08:35 +1",
    delay: "18 min late",
    current: "Kota Junction",
    next: "Ratlam Junction",
    updated: "5 min ago",
    stops: [
      { name: "New Delhi", code: "NDLS", time: "16:55", state: "departed", delay: "On time" },
      { name: "Kota Junction", code: "KOTA", time: "23:10", state: "current", delay: "18 min late" },
      { name: "Ratlam Junction", code: "RTM", time: "02:15", state: "upcoming", delay: "Expected 02:33" },
      { name: "Mumbai Central", code: "MMCT", time: "08:35", state: "upcoming", delay: "Expected 08:53" },
    ],
  },
  "12901": {
    number: "12901",
    name: "Gujarat Mail",
    from: "Mumbai Central",
    to: "Ahmedabad",
    departure: "21:40",
    arrival: "06:45 +1",
    delay: "On time",
    current: "Borivali",
    next: "Vapi",
    updated: "3 min ago",
    stops: [
      { name: "Mumbai Central", code: "MMCT", time: "21:40", state: "departed", delay: "On time" },
      { name: "Borivali", code: "BVI", time: "22:12", state: "current", delay: "On time" },
      { name: "Vapi", code: "VAPI", time: "00:25", state: "upcoming", delay: "Expected 00:25" },
      { name: "Ahmedabad", code: "ADI", time: "06:45", state: "upcoming", delay: "Expected 06:45" },
    ],
  },
};

export default function TrainStatusPage() {
  const [trainNumber, setTrainNumber] = useState("12951");
  const [result, setResult] = useState<Train | null>(trains["12951"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState("12951");

  function checkStatus(event: React.FormEvent) {
    event.preventDefault();
    const value = trainNumber.trim();
    if (!/^\d{4,5}$/.test(value)) {
      setError("Enter a valid 4 or 5 digit train number.");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    setLastSearched(value);

    window.setTimeout(() => {
      const found = trains[value];
      if (!found) {
        setResult(null);
        setError(`Demo status is not available for ${value} yet. Try 12951 or 12901.`);
      } else {
        setResult(found);
      }
      setLoading(false);
    }, 650);
  }

  function refreshStatus() {
    setTrainNumber(lastSearched);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 650);
  }

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
              onChange={(event) => setTrainNumber(event.target.value.replace(/\D/g, ""))}
              placeholder="Enter train number"
              aria-label="Train number"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Check Status"} <ArrowRight size={17} />
            </button>
          </form>
          {error && <p className={styles.error}><AlertCircle size={15} /> {error}</p>}
          <p className={styles.example}>Try demo trains: <button type="button" onClick={() => setTrainNumber("12951")}>12951</button> · <button type="button" onClick={() => setTrainNumber("12901")}>12901</button></p>
        </section>

        {loading && <section className={styles.statusCard}><div className={styles.loadingState}><RefreshCw size={22} className={styles.spin} /><strong>Fetching latest train status...</strong><span>Please wait a moment.</span></div></section>}

        {!loading && result && (
          <>
            <section className={styles.statusCard}>
              <div className={styles.statusTop}>
                <div>
                  <div className={styles.trainNo}>{result.number} <span>{result.name}</span></div>
                  <div className={styles.route}>{result.from} <ArrowRight size={17} /> {result.to}</div>
                </div>
                <span className={styles.delay}><Clock3 size={14} /> {result.delay}</span>
              </div>

              <div className={styles.currentBox}>
                <div className={styles.currentIcon}><MapPin size={21} /></div>
                <div><small>Currently at</small><strong>{result.current}</strong><span>Next stop: {result.next}</span></div>
                <div className={styles.updated}>Updated<br /><b>{result.updated}</b></div>
              </div>

              <div className={styles.timeline}>
                {result.stops.map((stop) => (
                  <div className={`${styles.stop} ${styles[stop.state]}`} key={stop.code}>
                    <div className={styles.dot}>{stop.state === "departed" && <CheckCircle2 size={15} />}</div>
                    <div className={styles.stopInfo}><strong>{stop.name}</strong><span>{stop.code} · {stop.time}</span><small>{stop.delay}</small></div>
                  </div>
                ))}
              </div>

              <button type="button" className={styles.refreshButton} onClick={refreshStatus}>
                <RefreshCw size={15} /> Refresh status
              </button>
            </section>

            <section className={styles.infoGrid}>
              <div><small>Departure</small><strong>{result.departure}</strong><span>{result.from}</span></div>
              <div><small>Expected arrival</small><strong>{result.arrival}</strong><span>{result.to}</span></div>
              <div><small>Running status</small><strong>{result.delay}</strong><span>Last updated {result.updated}</span></div>
            </section>

            <div className={styles.demoNote}>
              <ShieldCheck size={18} />
              <div><strong>Demo mode enabled</strong><p>This MVP currently uses safe demo data for testing the complete search, loading, error and refresh flow. A railway-status provider/API key is required before showing real live railway data.</p></div>
            </div>
          </>
        )}

        <footer><Link href="/pnr">Check PNR</Link><span>·</span><span>EXPRESS · Real-World Social Friends</span></footer>
      </div>
    </main>
  );
}
