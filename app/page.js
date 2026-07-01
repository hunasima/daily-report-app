"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522",
  storageBucket: "daily-report-27522.firebasestorage.app",
  messagingSenderId: "962362045585",
  appId: "1:962362045585:web:b8c6844939bfdd3b7b3b30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [form, setForm] = useState({});
  const [list, setList] = useState([]);

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  // ✅ リアルタイム取得
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setList(data);
    });
    return () => unsub();
  }, []);

  // ✅ 利用時間
  const calcTime = () => {
    if (!form.start || !form.end) return "";
    const s = new Date(`2024-01-01T${form.start}`);
    const e = new Date(`2024-01-01T${form.end}`);
    const diff = (e - s) / 60000;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}時間${m}分`;
  };

  // ✅ 合計
  const calcTotal = () => {
    return (Number(form.cash) || 0) + (Number(form.receivable) || 0);
  };

  // ✅ 保存
  const add = async () => {
    await addDoc(collection(db, "reports"), {
      ...form,
      duration: calcTime(),
      total: calcTotal()
    });

    setForm({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>日報アプリ（完全版）</h2>

      <input type="date" onChange={(e) => change("date", e.target.value)} />
      <input placeholder="利用者名" onChange={(e) => change("name", e.target.value)} />
      <input placeholder="迎先" onChange={(e) => change("place", e.target.value)} />

      <p>時間</p>
      <input type="time" onChange={(e) => change("start", e.target.value)} />
      <input type="time" onChange={(e) => change("end", e.target.value)} />

      <textarea placeholder="内容" onChange={(e) => change("content", e.target.value)} />
