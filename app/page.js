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
  projectId: "daily-report-27522"
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
      <h2>日報アプリ（業務版）</h2>

      <input type="date" onChange={(e) => change("date", e.target.value)} />
      <input placeholder="利用者名" onChange={(e) => change("name", e.target.value)} />
      <input placeholder="迎先" onChange={(e) => change("place", e.target.value)} />

      <p>時間</p>
      <input type="time" onChange={(e) => change("start", e.target.value)} />
      <input type="time" onChange={(e) => change("end", e.target.value)} />

      <textarea placeholder="内容" onChange={(e) => change("content", e.target.value)} />
      <textarea placeholder="備考" onChange={(e) => change("note", e.target.value)} />

      <input placeholder="現金売上" onChange={(e) => change("cash", e.target.value)} />
      <input placeholder="売掛" onChange={(e) => change("receivable", e.target.value)} />

      <p>利用時間：{calcTime()}</p>
      <p>合計：{calcTotal()} 円</p>

      <button onClick={add}>保存</button>

      <hr />

      {list.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{r.date} / {r.name}</p>
          <p>{r.place}</p>
          <p>{r.start}〜{r.end}（{r.duration}）</p>
          <p>{r.content}</p>
          <p>{r.note}</p>
          <p>売上：{r.total} 円</p>
        </div>
      ))}
    </div>
  );
}
``