"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  X,
} from "lucide-react";

const people = [
  { name: "Riya", age: 24, initials: "R", intent: ["Music", "Friends"], note: "Love good conversations and discovering new places." },
  { name: "Aarav", age: 26, initials: "A", intent: ["Photography", "Tech"], note: "Always up for a great travel story." },
  { name: "Neha", age: 23, initials: "N", intent: ["Food", "Travel"], note: "Chai, food and spontaneous plans." },
  { name: "Karan", age: 27, initials: "K", intent: ["Movies", "Chat"], note: "Easy conversations, no awkward intros." },
];

export default function Home() {
  const [active, setActive] = useState("Home");
  const [selected, setSelected] = useState<(typeof people)[number] | null>(null);
  const [hiSent, setHiSent] = useState<string[]>([]);
  const sendHi = (name: string) => setHiSent((current) => current.includes(name) ? current : [...current, name]);
  const goPnr = () => { window.location.href = "/pnr"; };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><TrainFront size={20} /></div><div><strong>EXPRESS</strong><span>Real-World Social Friends</span></div></div>
        <div className="side-context"><span className="live-dot" /> Journey active<div className="context-train">12901 Gujarat Mail</div><small>Ahmedabad → Mumbai</small></div>
        <nav>{["Home", "People", "Connections", "Profile"].map((item) => <button key={item} className={active === item ? "nav-item active" : "nav-item"} onClick={() => setActive(item)}>{item === "Home" ? "⌂" : item === "People" ? "◎" : item === "Connections" ? "♡" : "◯"}<span>{item}</span></button>)}</nav>
        <div className="sidebar-bottom"><ShieldCheck size={17} /><span>Privacy first</span></div>
      </aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">WED, 09 SEP · YOUR JOURNEY</p><h1>Good afternoon 👋</h1></div><div className="top-actions"><button className="icon-button"><Search size={19} /></button><button className="icon-button"><Bell size={19} /></button><div className="avatar small">D</div></div></header>
        <div className="journey-card"><div className="journey-main"><div className="route-label"><span>YOUR JOURNEY</span><span className="status-pill"><span className="live-dot" /> Running 18 min late</span></div><h2>12901 <span>Gujarat Mail</span></h2><div className="route"><b>Ahmedabad</b><ArrowRight size={18} /><b>Mumbai</b></div><p className="muted">Next stop <strong>Nadiad</strong> · Updated 5 min ago</p></div><div className="train-illustration"><div className="sun" /><div className="track" /><TrainFront size={88} strokeWidth={1.2} /></div><div className="journey-actions"><button className="secondary" onClick={goPnr}>View PNR</button><button className="primary">Live Status <ArrowRight size={16} /></button></div></div>
        <section className="social-section"><div className="section-heading"><div><p className="eyebrow blue">THE REASON EXPRESS EXISTS</p><h2>People on your train</h2><p className="muted">You’re sharing this journey with <strong>42 people</strong> who are open to connect.</p></div><button className="link-button">See all <ChevronRight size={16} /></button></div><div className="people-grid">{people.map((person) => <article className="person-card" key={person.name} onClick={() => setSelected(person)}><div className={`person-avatar tone-${person.initials}`}>{person.initials}</div><div className="person-body"><div className="person-title"><h3>{person.name}, {person.age}</h3><span className="online" /></div><p>{person.note}</p><div className="tags">{person.intent.map((tag) => <span key={tag}>{tag}</span>)}</div></div><button className={hiSent.includes(person.name) ? "hi-button sent" : "hi-button"} onClick={(e) => { e.stopPropagation(); sendHi(person.name); }}>{hiSent.includes(person.name) ? <><Check size={15} /> Sent</> : <><span>👋</span> Say Hi</>}</button></article>)}</div></section>
        <section className="moment-card"><div className="moment-icon"><Sparkles size={21} /></div><div><p className="eyebrow">MAKE THE MOMENT COUNT</p><h3>Maybe your next friend is on this journey.</h3><p className="muted">Profiles are visible before a request. Chat starts only when both people accept.</p></div><button className="primary wide">Meet People <ArrowRight size={17} /></button></section>
        <div className="quick-grid"><button className="quick" onClick={goPnr}><div className="quick-icon"><TrainFront size={18} /></div><div><strong>Check PNR</strong><small>Booking & seat status</small></div><ChevronRight size={17} /></button><button className="quick"><div className="quick-icon green"><Clock3 size={18} /></div><div><strong>Live Train Status</strong><small>Stops & running updates</small></div><ChevronRight size={17} /></button><div className="quick"><div className="quick-icon pink"><Heart size={18} /></div><div><strong>Connections</strong><small>People you’ve met</small></div><ChevronRight size={17} /></div></div>
        <footer><span>EXPRESS · Real-World Social Friends</span><span><ShieldCheck size={14} /> Your PNR is private</span></footer>
      </section>
      {selected && <div className="overlay" onClick={() => setSelected(null)}><div className="profile-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}><X size={18} /></button><div className="modal-avatar">{selected.initials}</div><p className="eyebrow blue">SAME JOURNEY</p><h2>{selected.name}, {selected.age}</h2><p className="muted">Travelling Ahmedabad → Mumbai</p><div className="tags centered">{selected.intent.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="profile-note">“{selected.note}”</p><div className="privacy-note"><ShieldCheck size={17} /> Exact seat, coach and PNR are never shown to other people.</div><button className="primary modal-action" onClick={() => { sendHi(selected.name); setSelected(null); }}><span>👋</span> Say Hi to {selected.name}</button></div></div>}
      <div className="mobile-nav">{["Home", "People", "Connections", "Profile"].map((item) => <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}><span>{item === "Home" ? "⌂" : item === "People" ? "◎" : item === "Connections" ? "♡" : "◯"}</span>{item}</button>)}</div>
    </main>
  );
}
