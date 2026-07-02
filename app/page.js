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

const app = initializeApp({
  apiKey: "AIzaSy...",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522"
});

const db = getFirestore(app);

export default function Home() {
  const [form, setForm] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);

  const change = (k,v)=>{
    setForm(prev => ({ ...prev, [k]: v }));
  };

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"reports"),snap=>{
      setList(snap.docs.map(d=>({
        id:d.id,
        ...d.data()
      })));
    });
    return ()=>unsub();
  },[]);

  const transport = (Number(form.distance)||0)*40;

  const total =
    (Number(form.cash)||0) +
    (Number(form.receivable)||0) +
    transport;

  const save = async ()=>{
    const data = { ...form, transport, total };

    if(editId){
      await updateDoc(doc(db,"reports",editId),data);
      setEditId(null);
    }else{
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
    <div style={{padding:20}}>
      <h2>日報</h2>

      <input type="date" value={form.date||""} onChange={e=>change("date",e.target.value)} />
      <input placeholder="利用者" value={form.name||""} onChange={e=>change("name",e.target.value)} />
      <input placeholder="迎先" value={form.place||""} onChange={e=>change("place",e.target.value)} />

      <input type="time" value={form.start||""} onChange={e=>change("start",e.target.value)} />
      <input type="time" value={form.end||""} onChange={e=>change("end",e.target.value)} />

      <input placeholder="内容" value={form.content||""} onChange={e=>change("content",e.target.value)} />

      <button onClick={save}>保存</button>

      <hr/>

      <table border="1">
        <thead>
          <tr>
            <th>日付</th>
            <th>利用者</th>
            <th>迎先</th>
            <th>時間</th>
            <th>内容</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {list.map((r)=>(
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.name}</td>
              <td>{r.place}</td>
              <td>{r.start}〜{r.end}</td>
              <td>{r.content}</td>
              <td>
                <button onClick={()=>edit(r)}>編集</button>
                <button onClick={()=>remove(r.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>  </table>

    </div>
  );
}