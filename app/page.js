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

  const calcTime = () => {
    if (!form.start || !form.end) return "";
    const s = new Date(`2024-01-01T${form.start}`);
    const e = new Date(`2024-01-01T${form.end}`);
    const diff = (e - s) / 60000;
    return `${Math.floor(diff/60)}時間${diff%60}分`;
  };

  const calcTotal = (r) => {
    return (Number(r.cash)||0)+(Number(r.receivable)||0);
  };

  const save = async () => {
    const data = {
      ...form,
      duration: calcTime(),
      total: calcTotal(form)
    };

    if (editId) {
      await updateDoc(doc(db,"reports",editId),data);
      setEditId(null);
    } else {
      await addDoc(collection(db,"reports"),data);
    }
    setForm({});
  };

  const remove = async(id)=>{
    await deleteDoc(doc(db,"reports",id));
  };

  const edit = (r)=>{
    setForm(r);
    setEditId(r.id);
  };

  // ✅ CSV
  const downloadCSV = () => {
    const headers = [
      "日付","利用者名","迎先","開始","終了","内容","備考",
      "担当","現金売上","売掛","交通費","距離"
    ];

    const rows = list.map(r => [
      r.date,r.name,r.place,r.start,r.end,
      r.content,r.note,r.staff,
      r.cash,r.receivable,r.transport,r.distance
    ]);

    const csv =
      [headers,...rows].map(e=>e.join(",")).join("\n");

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  return (
    <div style={{ padding:20 }}>
      <h2>日報アプリ（最終版）</h2>

      {/* 入力 */}
      <input type="date" value={form.date||""} onChange={e=>change("date",e.target.value)} />
      <input placeholder="利用者名" value={form.name||""} onChange={e=>change("name",e.target.value)} />
      <input placeholder="迎先" value={form.place||""} onChange={e=>change("place",e.target.value)} />

      <input type="time" value={form.start||""} onChange={e=>change("start",e.target.value)} />
      <input type="time" value={form.end||""} onChange={e=>change("end",e.target.value)} />

      <textarea placeholder="内容" value={form.content||""} onChange={e=>change("content",e.target.value)} />
      <textarea placeholder="備考" value={form.note||""} onChange={e=>change("note",e.target.value)} />

      <input placeholder="担当者" value={form.staff||""} onChange={e=>change("staff",e.target.value)} />

      <input placeholder="現金売上" value={form.cash||""} onChange={e=>change("cash",e.target.value)} />
      <input placeholder="売掛" value={form.receivable||""} onChange={e=>change("receivable",e.target.value)} />

      <input placeholder="交通費" value={form.transport||""} onChange={e=>change("transport",e.target.value)} />
      <input placeholder="距離(Km)" value={form.distance||""} onChange={e=>change("distance",e.target.value)} />

      <p>利用時間：{calcTime()}</p>
      <p>合計：{calcTotal(form)} 円</p>

      <button onClick={save}>
        {editId ? "更新" : "保存"}
      </button>

      <button onClick={downloadCSV}>
        CSVダウンロード
      </button>

      <hr />

      {/* 表 */}
      <table border="1" style={{ width:"100%" }}>
        <thead>
          <tr>
            <th>日付</th>
            <th>利用者</th>
            <th>迎先</th>
            <th>時間</th>
            <th>内容</th>
            <th>売上</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.name}</td>
              <td>{r.place}</td>
              <td>{r.start}～{r.end}</td>
              <td>{r.content}</td>
              <td>{r.total}</td>
              <td>
                <button onClick={()=>edit(r)}>編集</button>
                <button onClick={()=>remove(r.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}