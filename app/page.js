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

  // ✅ リアルタイム取得
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setList(data);
    });
    return () => unsub();
  }, []);

  // ✅ 保存
  const add = async () => {
    if (!form.name) return;

    if (editId) {
      // 編集
      await updateDoc(doc(db, "reports", editId), form);
      setEditId(null);
    } else {
      // 新規
      await addDoc(collection(db, "reports"), form);
    }

    setForm({});
  };

  // ✅ 削除
  const remove = async (id) => {
    await deleteDoc(doc(db, "reports", id));
  };

  // ✅ 編集開始
  const startEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>日報アプリ（完成版）</h2>

      <input
        placeholder="利用者名"
        value={form.name || ""}
        onChange={(e) => change("name", e.target.value)}
      />
      <input
        placeholder="迎先"
        value={form.place || ""}
        onChange={(e) => change("place", e.target.value)}
      />
      <textarea
        placeholder="内容"
        value={form.content || ""}
        onChange={(e) => change("content", e.target.value)}
      />

      {/* 保存ボタン */}
      <button onClick={add}>
        {editId ? "更新" : "保存"}
      </button>

      <hr />

      {list.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{r.name}</p>
          <p>{r.place}</p>
          <p>{r.content}</p>

          {/* 🔥 編集 */}
          <button onClick={() => startEdit(r)}>
            編集
          </button>

          {/* 🔥 削除 */}
          <button onClick={() => remove(r.id)}>
            削除
          </button>
        </div>
      ))}
    </div>
  );
}