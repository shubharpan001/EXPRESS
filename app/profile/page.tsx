"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Edit3, Heart, ShieldCheck, TrainFront } from "lucide-react";
import styles from "./profile.module.css";

export default function ProfilePage(){
  const [editing,setEditing]=useState(false);
  const [saved,setSaved]=useState(false);
  const [bio,setBio]=useState("Traveller, chai lover and always happy to meet interesting people along the way.");
  const [interests,setInterests]=useState(["Travel","Music","Food","Cricket"]);
  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={18}/> Home</Link><div className={styles.logo}><span><TrainFront size={18}/></span><strong>EXPRESS</strong></div><Link href="/people" className={styles.people}>People</Link></header>
    <section className={styles.hero}><div className={styles.avatar}>D<i/></div><div><p className={styles.eyebrow}>MY PROFILE</p><h1>Dhiraj</h1><p>Profile visible to people you choose to discover.</p></div><button className={styles.edit} onClick={()=>setEditing(!editing)}><Edit3 size={16}/> {editing?"Done":"Edit"}</button></section>
    <section className={styles.section}><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>ABOUT YOU</p><h2>Your profile</h2></div><span className={styles.complete}>80% complete</span></div>{editing?<textarea value={bio} onChange={e=>setBio(e.target.value)} className={styles.textarea}/>:<p className={styles.bio}>{bio}</p>}<div className={styles.tags}>{interests.map(x=><span key={x}>{x}</span>)}</div>{editing&&<button className={styles.save} onClick={()=>{setSaved(true);setEditing(false)}}>{saved?<><Check size={15}/> Saved</>:"Save changes"}</button>}</section>
    <section className={styles.section}><p className={styles.eyebrow}>CURRENT JOURNEY</p><div className={styles.journey}><div className={styles.trainIcon}><TrainFront size={22}/></div><div><strong>12901 · Gujarat Mail</strong><span>Ahmedabad → Mumbai · 10 Sep 2026</span></div><ChevronRight size={17}/></div><p className={styles.private}><ShieldCheck size={15}/> Your PNR, coach and seat are never visible on your social profile.</p></section>
    <section className={styles.section}><p className={styles.eyebrow}>SOCIAL PRIVACY</p><div className={styles.rows}><div><Heart size={17}/><span><strong>Who can discover me</strong><small>People sharing my active journey</small></span><b>On</b></div><div><ShieldCheck size={17}/><span><strong>Journey details</strong><small>Only route and journey date are shared</small></span><b>Private</b></div></div></section>
    <footer><Link href="/people">Discover people</Link><Link href="/">Back to Home</Link></footer>
  </div></main>;
}
