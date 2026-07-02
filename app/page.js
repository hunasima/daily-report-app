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

  // ✅ ここ直し！！
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

  const calcTotal = (r) => {
    return (Number(r.cash)||0)+(Number(r.receivable)||0);
  };

  const save = async () => {
    const data = {
      ...form,
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

  return (
    <div style={{ padding:20 }}>
      <h2>日報アプリ（完全版）</h2>

      {/* 入力 */}
      <input type="date" value={form.date||""} onChange={(e)=>change("date",e.target.value)} />
      <input placeholder="利用者名" value={form.name||""} onChange={(e)=>change("name",e.target.value)} />
      <input placeholder="迎先" value={form.place||""} onChange={(e)=>change("place",e.target.value)} />

      <textarea placeholder="内容①" value={form.content1||""} onChange={(e)=>change("content1",e.target.value)} />
      <textarea placeholder="内容②" value={form.content2||""} onChange={(e)=>change("content2",e.target.value)} />

      <input placeholder="現金売上" value={form.cash||""} onChange={(e)=>change("cash",e.target.value)} />
      <input placeholder="売掛" value={form.receivable||""} onChange={(e)=>change("receivable",e.target.value)} />

      <button onClick={save}>{editId ? "更新" : "保存"}</button>

      <hr/>

      <table border="1" style={{ width:"100%" }}>
        <thead>
          <tr>
            <th>日付</th><th>利用者</th><th>迎先</th>
            <th>内容①</th><th>内容②</th>
            <th>売上</th><th>操作</th>
          </tr>
        </thead>

        <tbody>
          {list.map((r)=>(
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.name}</td>
              <td>{r.place}</td>
              <td>{r.content1}</td>
              <td>{r.content2}</td>
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