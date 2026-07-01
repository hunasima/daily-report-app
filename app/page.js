"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// 🔥 ここにあなたのコピーした config を貼る
const firebaseConfig = {
  apiKey: "あなたの値",
  authDomain: "あなたの値",
  projectId: "あなたの値",
  storageBucket: "あなたの値",
  messagingSenderId: "あなたの値",
  appId: "あなたの値"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  // ✅ データ取得（クラウドから読む）
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "reports"));
      const data = snapshot.docs.map(doc => doc.data());
      setList(data);
    };
    fetchData();
  }, []);

  // ✅ 保存（クラウドに書く）
  const add = async () => {
    if (!text) return;

    await addDoc(collection(db, "reports"), {
      content: text
    });

    setList([...list, { content: text }]);
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>日報アプリ（クラウド版）</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="入力"
      />

      <button onClick={add}>追加</button>

      {list.map((item, i) => (
        <p key={i}>{item.content}</p>
      ))}
    </div>
  );
}
