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
    setForm((prev) => ({ ...prev, [k]: v })); // ✅ 修正ポイント
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

  // ✅ 時間表示
  const timeText = (r) => `${r.start || ""}〜${r.end || ""}`;

  // ✅ 交通費
  const transport = (Number(form.distance)||0) * 40;

  // ✅ 売上合計
  const total =
    (Number(form.cash)||0) +
    (Number(form.receivable)||0) +
    transport;

  const save = async () => {
    const data = {
      ...form,
      transport,
      total
    };

    if (editId) {
      await updateDoc(doc(db,"reports",editId),data);
      setEditId(null);
    } else {
      await addDoc(collection(db,"reports"),data);
    }

    setForm({});
  };

  const remove = async (id) => {
    await deleteDoc(doc(db,"reports",id));
  };

  const edit = (r) => {
const downloadCSV = () => {
  const headers = [
    "日付","利用者","担当","開始","終了","内容","売上合計","立替"
  ];

  const rows = list.map(r => [
    r.date, r.name, r.staff, r.start, r.end,
    r.content, r.total, r.advance
  ]);
<button onClick={downloadCSV}>CSV</button>

  const csv = [headers, ...rows]
    .map(e => e.join(","))
    .join("\n");

  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csv]);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
};
    setForm(r);
    setEditId(r.id);
  };

  return (
    <div style={{ padding:20 }}>
      <h2>日報（業務版）</h2>

      {/* 入力 */}
      <input type="date" value={form.date||""} onChange={(e)=>change("date",e.target.value)} />
      <input placeholder="利用者" value={form.name||""} onChange={(e)=>change("name",e.target.value)} />
      <input placeholder="担当" value={form.staff||""} onChange={(e)=>change("staff",e.target.value)} />

      <input type="time" value={form.start||""} onChange={(e)=>change("start",e.target.value)} />
      <input type="time" value={form.end||""} onChange={(e)=>change("end",e.target.value)} />

      <input placeholder="内容" value={form.content||""} onChange={(e)=>change("content",e.target.value)} />

      <input placeholder="現金売上" value={form.cash||""} onChange={(e)=>change("cash",e.target.value)} />
      <input placeholder="売掛" value={form.receivable||""} onChange={(e)=>change("receivable",e.target.value)} />
      <input placeholder="距離" value={form.distance||""} onChange={(e)=>change("distance",e.target.value)} />

      <p>交通費：{transport}</p>
      <p>売上合計：{total}</p>

      <button onClick={save}>
        {editId ? "更新" : "保存"}
      </button>

      <hr/>

      {/* 表 */}
      <thead style={{ background:"#2f6b6f", color:"#fff" }}>
  <tr>
    <th>日付</th>
    <th>利用者</th>
    <th>担当</th>
    <th>時間</th>
    <th>内容</th>
    <th>売上合計</th>
    <th>立替</th>
    <th>操作</th>
  </tr>
</thead>

<tbody>
  {list.map((r)=>(
    <tr key={r.id}>
      <td>{r.date}</td>
      <td>{r.name}</td>
      <td>{r.staff}</td>
      <td>{r.start}〜{r.end}</td>
      <td>{r.content}</td>
      <td>{r.total}</td>
      <td>{r.advance}</td>
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
