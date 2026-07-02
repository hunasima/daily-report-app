"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [form, setForm] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      setList(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    return () => unsub();
  }, []);

  const save = async () => {
    if (!form.name) return;

    if (editId) {
      await updateDoc(doc(db, "reports", editId), form);
      setEditId(null);
    } else {
      await addDoc(collection(db, "reports"), form);
    }
    setForm({});
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "reports", id));
  };

  const edit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>日報アプリ（最終版）</h2>

      {/* 入力項目 */}
      <input type="date" value={form.date || ""} onChange={(e) => change("date", e.target.value)} />
      <input placeholder="利用者名" value={form.name || ""} onChange={(e) => change("name", e.target.value)} />
      <input placeholder="迎先" value={form.place || ""} onChange={(e) => change("place", e.target.value)} />

      <input type="time" value={form.start || ""} onChange={(e) => change("start", e.target.value)} />
      <input type="time" value={form.end || ""} onChange={(e) => change("end", e.target.value)} />

      <textarea placeholder="内容" value={form.content || ""} onChange={(e) => change("content", e.target.value)} />

