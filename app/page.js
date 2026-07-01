"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522",
  storageBucket: "daily-report-27522.firebasestorage.app",
  messagingSenderId: "962362045585",
  appId: "1:962362045585:web:b8c6844939bfdd3b7b3b30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "reports"));
      const data = snapshot.docs.map(doc => doc.data());
      setList(data);
    };
    fetchData();
  }, []);

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

      {/* 入力欄 */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに入力"
      />

      {/* 🔥 ここがボタン */}
      <button onClick={add}>
        追加
      </button>

      {/* 一覧 */}
      {list.map((item, i) => (
        <p key={i}>{item.content}</p>
      ))}
    </div>
  );
}