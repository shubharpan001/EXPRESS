"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, ShieldCheck, TrainFront } from "lucide-react";
import styles from "./profile.module.css";

const profiles: Record<string, {name:string;age:number;initials:string;city:string;interests:string[];bio:string}> = {
  riya:{name:"Riya",age:24,initials:"R",city:"Ahmedabad",interests:["Music","Friends","Travel"],bio:"Love good conversations and discovering new places."},
  aarav:{name:"Aarav",age:26,initials:"A",city:"Vadodara",interests:["Photography","Tech","Travel"],bio:"Always up for a great travel story."},
  neha:{name:"Neha",age:23,initials:"N",city:"Surat",interests:["Food","Travel","Chai"],bio:"Chai, food and spontaneous plans."},
  karan:{name:"Karan",age:27,initials:"K",city:"Mumbai",interests:["Movies","Chat","Music"],bio:"Easy conversations, no awkward intros."},
  meera:{name:"Meera",age:25,initials:"M",city:"Jaipur",interests:["Books","Art","Travel"],bio:"Collecting stories from every city I visit."},
  dev:{name:"Dev",age:28,initials:"D",city:"Delhi",interests:["Cricket","Tech","Food"],bio:"Good food, long journeys and better conversations."},
};

export default function PersonProfile({params}:{params:{id:string}}){
  const person=profiles[params.id] ?? profiles.riya;
  const [sent,setSent]=useState(false);
  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><Link href="/people" className={styles.back}><ArrowLeft size={18}/> People</Link><div className={styles.logo}><span><TrainFront size={18}/></span><strong>EXPRESS</strong></div></header>
    <section className={styles.card}>
      <div className={`${styles.avatar} ${styles[person.initials]}`}>{person.initials}<i/></div>
      <p className={styles.eyebrow}>SAME JOURNEY · OPEN TO CONNECT</p>
      <h1>{person.name}, {person.age}</h1><p className={styles.city}>{person.city}</p>
      <div className={styles.route}><strong>12901 · Gujarat Mail</strong><span>Ahmedabad → Mumbai</span></div>
      <p className={styles.bio}>“{person.bio}”</p>
      <div className={styles.tags}>{person.interests.map(x=><span key={x}>{x}</span>)}</div>
      <div className={styles.privacy}><ShieldCheck size={18}/><div><strong>Privacy protected</strong><p>PNR, coach, seat number and exact location are hidden. Only journey-level information is shared.</p></div></div>
      <div className={styles.actions}>{sent ? <button className={styles.sent}><Check size={17}/> Request sent</button> : <button className={styles.primary} onClick={()=>setSent(true)}><span>👋</span> Say Hi</button>}<button className={styles.secondary}><MessageCircle size={17}/> Chat after connection</button></div>
    </section>
    <div className={styles.note}><strong>How connection works</strong><p>Send a friendly request first. Chat becomes available only after the other person accepts.</p></div>
    <footer><Link href="/people">Back to People</Link><span>EXPRESS · Real-World Social Friends</span></footer>
  </div></main>;
}
