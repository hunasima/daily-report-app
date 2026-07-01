"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({});
  const [list, setList] = useState([]);

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const calcTime = () => {
    if (!form.start || !form.end) return "";
    const s = new Date(`2024-01-01T${form.start}`);
    const e = new Date(`2024-01-01T${form.end}`);
    const diff = (e - s) / 60000;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}時間${m}分`;
  };

  const calcTotal = () => {
    return (
      (Number(form.cash) || 0) +
      (Number(form.receivable) || 0)
    );
  };

  const add = () => {
    const data = {
      ...form,
      duration: calcTime(),
      total: calcTotal(),
    };
    setList([data, ...list]);
    setForm({});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>日報アプリ</h2>

      <input type="date" onChange={(e) => change("date", e.target.value)} />
      <input placeholder="利用者名" onChange={(e) => change("name", e.target.value)} />
      <input placeholder="迎先" onChange={(e) => change("place", e.target.value)} />

      <p>時間</p>
      <input type="time" onChange={(e) => change("start", e.target.value)} />
      <input type="time" onChange={(e) => change("end", e.target.value)} />

      <textarea placeholder="内容" onChange={(e) => change("content", e.target.value)} />
      <textarea placeholder="備考" onChange={(e) => change("note", e.target.value)} />

      <input placeholder="担当者" onChange={(e) => change("staff", e.target.value)} />

      <p>金額</p>
      <input placeholder="現金売上" onChange={(e) => change("cash", e.target.value)} />
      <input placeholder="売掛" onChange={(e) => change("receivable", e.target.value)} />
      <input placeholder="交通費" onChange={(e) => change("transport", e.target.value)} />

      <input placeholder="走行距離(Km)" onChange={(e) => change("distance", e.target.value)} />

      <p>利用時間：{calcTime()}</p>
      <p>売上合計：{calcTotal()} 円</p>

      <button onClick={add}>追加</button>

      <hr />

      {list.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{r.date} / {r.name}</p>
          <p>{r.place}</p>
          <p>{r.start}〜{r.end}（{r.duration}）</p>
          <p>{r.content}</p>
          <p>{r.note}</p>
          <p>担当：{r.staff}</p>
          <p>売上：{r.total} 円</p>
        </div>
      ))}
    </div>
  );
}
``