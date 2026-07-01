"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  const add = () => {
    if (!text) return;
    setList([...list, text]);
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>日報アプリ</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={add}>
        追加
      </button>

      {list.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  );
}
