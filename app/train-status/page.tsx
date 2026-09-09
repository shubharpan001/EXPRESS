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
} from "lucide-react";
import styles from "./train-status.module.css";

const demoTrain = {
  number: "12951",
  name: "Rajdhani Express",
  from: "New Delhi",
  to: "Mumbai Central",
  departure: "16:55",
  arrival: "08:35 +1",
  delay: "18 min late",
  current: "Kota Junction",
  next: "Ratlam Junction",
  updated: "5 min ago",
};

const stops = [
  { name: "New Delhi", code: "NDLS", time: "16:55", state: "departed", delay: "On time" },
  { name: "Kota Junction", code: "KOTA", time: "23:10", state: "current", delay: "18 min late" },
  { name: "Ratlam Junction", code: "RTM", time: "02:15", state: "upcoming", delay: "Expected 02:33" },
  { name: "Mumbai Central", code: "MMCT", time: "08:35", state: "upcoming", delay: "Expected 08:53" },
];

export default function TrainStatusPage() {
  const [trainNumber, setTrainNumber] = useState("12951");
  const [searched, setSearched] = useState(true);
  const [error, setError] = useState("");

  function checkStatus(event: React.FormEvent) {
    event.preventDefault();
    const value = trainNumber.trim();
    if (!/^\d{4,5}$/.test(value)) {
      setError("Enter a valid 4 or 5 digit train number.");
      setSearched(false);
      return;
    }
    setError("");
    setSearched(true);
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
              onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter train number"
              aria-label="Train number"
            />
            <button type="submit">Check Status <ArrowRight size={17} /></button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.example}>Try demo train: 12951</p>
        </section>

        {searched && (
          <>
            <section className={styles.statusCard}>
              <div className={styles.statusTop}>
                <div>
                  <div className={styles.trainNo}>{demoTrain.number} <span>{demoTrain.name}</span></div>
                  <div className={styles.route}>{demoTrain.from} <ArrowRight size={17} /> {demoTrain.to}</div>
                </div>
                <span className={styles.delay}><Clock3 size={14} /> {demoTrain.delay}</span>
              </div>

              <div className={styles.currentBox}>
                <div className={styles.currentIcon}><MapPin size={21} /></div>
                <div><small>Currently at</small><strong>{demoTrain.current}</strong><span>Next stop: {demoTrain.next}</span></div>
                <div className={styles.updated}>Updated<br /><b>{demoTrain.updated}</b></div>
              </div>

              <div className={styles.timeline}>
                {stops.map((stop) => (
                  <div className={`${styles.stop} ${styles[stop.state]}`} key={stop.code}>
                    <div className={styles.dot}>{stop.state === "departed" && <CheckCircle2 size={15} />}</div>
                    <div className={styles.stopInfo}><strong>{stop.name}</strong><span>{stop.code} · {stop.time}</span><small>{stop.delay}</small></div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.infoGrid}>
              <div><small>Departure</small><strong>{demoTrain.departure}</strong><span>{demoTrain.from}</span></div>
              <div><small>Expected arrival</small><strong>{demoTrain.arrival}</strong><span>{demoTrain.to}</span></div>
              <div><small>Running status</small><strong>18 min late</strong><span>Last updated {demoTrain.updated}</span></div>
            </section>

            <div className={styles.demoNote}>
              <ShieldCheck size={18} />
              <div><strong>Live provider not connected yet</strong><p>This screen is ready for a railway-status API. Until a provider is configured, the displayed 12951 journey is demo data and is not a live railway update.</p></div>
            </div>
          </>
        )}

        <footer><Link href="/pnr">Check PNR</Link><span>·</span><span>EXPRESS · Real-World Social Friends</span></footer>
      </div>
    </main>
  );
}
