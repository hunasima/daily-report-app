"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// 🔥 Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522",
  storageBucket: "daily-report-27522.firebasestorage.app",
  messagingSenderId: "962362045585",
  appId: "1:962362045585:web:b8c6844939bfdd3b7b3b30"
};

// 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  // ✅ データ読み込み
  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "reports"));
    const data = snapshot.docs.map(doc => doc.data());
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 追加
  const add = async () => {
    if (!text) return;

    await addDoc(collection(db, "reports"), {
      content: text
    });

    setText("");
    fetchData(); // 🔥 保存後に再取得
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>日報アプリ（クラウド版）</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに入力"
      />

      <button onClick={add}>
        追加
      </button>

      {list.map((item, i) => (
        <p key={i}>{item.content}</p>
      ))}
    </div>
  );
}