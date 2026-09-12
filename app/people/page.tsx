"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, MapPin, ShieldCheck, TrainFront, UserRound } from "lucide-react";
import styles from "./people.module.css";

const people = [
  { id: "riya", name: "Riya", age: 24, initials: "R", city: "Ahmedabad", interests: ["Music", "Friends", "Travel"], bio: "Love good conversations and discovering new places.", distance: "Same journey", online: true },
  { id: "aarav", name: "Aarav", age: 26, initials: "A", city: "Vadodara", interests: ["Photography", "Tech", "Travel"], bio: "Always up for a great travel story.", distance: "Same journey", online: true },
  { id: "neha", name: "Neha", age: 23, initials: "N", city: "Surat", interests: ["Food", "Travel", "Chai"], bio: "Chai, food and spontaneous plans.", distance: "Same journey", online: false },
  { id: "karan", name: "Karan", age: 27, initials: "K", city: "Mumbai", interests: ["Movies", "Chat", "Music"], bio: "Easy conversations, no awkward intros.", distance: "Same journey", online: true },
  { id: "meera", name: "Meera", age: 25, initials: "M", city: "Jaipur", interests: ["Books", "Art", "Travel"], bio: "Collecting stories from every city I visit.", distance: "Same journey", online: true },
  { id: "dev", name: "Dev", age: 28, initials: "D", city: "Delhi", interests: ["Cricket", "Tech", "Food"], bio: "Good food, long journeys and better conversations.", distance: "Same journey", online: false },
];

export default function PeoplePage() {
  const [sent, setSent] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const visible = filter === "Online" ? people.filter((p) => p.online) : filter === "Interests" ? people.filter((p) => p.interests.includes("Travel") || p.interests.includes("Music")) : people;

  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={18} /> Home</Link><div className={styles.logo}><span><TrainFront size={18} /></span><strong>EXPRESS</strong></div><Link href="/profile" className={styles.profile}><UserRound size={18} /></Link></header>
    <section className={styles.hero}><p className={styles.eyebrow}>SOCIAL DISCOVERY</p><h1>People on your train</h1><p>Meet people who are sharing your journey and are open to making a connection.</p><div className={styles.journey}><div><strong>12901 · Gujarat Mail</strong><span>Ahmedabad → Mumbai</span></div><b>42 people</b></div></section>
    <div className={styles.filters}>{["All", "Online", "Interests"].map((item) => <button key={item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <section className={styles.grid}>{visible.map((person) => <article className={styles.card} key={person.id}><Link href={`/people/${person.id}`} className={styles.cardMain}><div className={`${styles.avatar} ${styles[`tone${person.initials}`]}`}>{person.initials}<span className={person.online ? styles.online : styles.offline} /></div><div className={styles.cardBody}><div className={styles.title}><h2>{person.name}, {person.age}</h2><span>{person.distance}</span></div><div className={styles.location}><MapPin size={12} /> {person.city}</div><p>{person.bio}</p><div className={styles.tags}>{person.interests.map((tag) => <span key={tag}>{tag}</span>)}</div></div><ChevronRight size={18} className={styles.chevron} /></Link><div className={styles.actions}><Link href={`/people/${person.id}`} className={styles.view}>View profile</Link><button className={sent.includes(person.id) ? styles.sent : styles.sayHi} onClick={() => setSent((s) => s.includes(person.id) ? s : [...s, person.id])}>{sent.includes(person.id) ? <><Check size={15} /> Request sent</> : <><span>👋</span> Say Hi</>}</button></div></article>)}</section>
    <div className={styles.privacy}><ShieldCheck size={18} /><div><strong>Your journey stays private</strong><p>Other passengers never see your PNR, coach, seat or exact location.</p></div></div>
    <footer><Link href="/">Home</Link><span>·</span><Link href="/profile">My Profile</Link><span>·</span><span>EXPRESS</span></footer>
  </div></main>;
}
