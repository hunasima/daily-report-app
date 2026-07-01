"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snap) => {
      setList(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, []);

  const add = async () => {
    if (!text) return;
    await addDoc(collection(db, "reports"), { content: text });
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>日報アプリ（クラウド版）</h1>

      <input value={text} onChange={(e)=>setText(e.target.value)} />
      <button onClick={add}>追加</button>

      {list.map((x,i)=><p key={i}>{x.content}</p>)}
    </div>
  );
}