"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const empty = {
    date: "", name: "", pickup: "",
    start: "", end: "",
    content: "", note: "",
    charge: "", sales: "", receivable: "", cost: "", road: "", cash: "", distance: ""
  };

  const [form, setForm] = useState(empty);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(JSON.parse(localStorage.getItem("reports") || "[]"));
  }, []);

  const change = (k, v) => setForm({ ...form, [k]: v });

  // 利用時間
  const calcTime = () => {
    if (!form.start || !form.end) return "";
    const s = new Date(`2024-01-01T${form.start}`);
    const e = new Date(`2024-01-01T${form.end}`);
    const diff = (e - s) / 60000;
    return `${Math.floor(diff / 60)}:${String(diff % 60).padStart(2, "0")}`;
  };

  // 売上合計
  const total = () => {
    return (Number(form.sales) || 0)
      + (Number(form.receivable) || 0);
  };

  const save = () => {
    const newData = {
      ...form,
      duration: calcTime(),
      total: total()
    };
    const updated = [newData, ...reports];
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
    setForm(empty);
  };

  const remove = (i) => {
    const updated = reports.filter((_, idx) => idx !== i);
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
  };

  // CSV
  const download = () => {
    const header = ["日付","利用者","迎先","開始","終了","時間","内容","備考","売上","売掛","合計"];
    const rows = reports.map(r =>
      [r.date,r.name,r.pickup,r.start,r.end,r.duration,r.content,r.note,r.sales,r.receivable,r.total].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");

   const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: 20 }}>
      <h2>📱 日報アプリ</h2>

      <input type="date" value={form.date} onChange={e=>change("date",e.target.value)} />
      <input placeholder="利用者名" value={form.name} onChange={e=>change("name",e.target.value)} />
      <input placeholder="迎先" value={form.pickup} onChange={e=>change("pickup",e.target.value)} />

      <input type="time" value={form.start} onChange={e=>change("start",e.target.value)} />
      <input type="time" value={form.end} onChange={e=>change("end",e.target.value)} />

      <textarea placeholder="内容" value={form.content} onChange={e=>change("content",e.target.value)} />
      <textarea placeholder="備考" value={form.note} onChange={e=>change("note",e.target.value)} />

      <input placeholder="売上" value={form.sales} onChange={e=>change("sales",e.target.value)} />
      <input placeholder="売掛" value={form.receivable} onChange={e=>change("receivable",e.target.value)} />

      <p>利用時間：{calcTime()}</p>
      <p>合計：{total()} 円</p>

      <button onClick={save} style={{ width:"100%", padding:10, background:"#0070f3", color:"#fff" }}>
        保存
      </button>

      <button onClick={download} style={{ marginTop:10 }}>
        CSVダウンロード
      </button>

      <h3>一覧</h3>

      {reports.map((r,i)=>(
        <div key={i} style={{ background:"#eee", padding:10, marginTop:10 }}>
          <p>{r.date} / {r.name}</p>
          <p>{r.start}→{r.end} ({r.duration})</p>
          <p>{r.content}</p>
          <p>合計：{r.total}円</p>
          <button onClick={()=>remove(i)}>削除</button>
        </div>
      ))}
    </div>
  );
}
