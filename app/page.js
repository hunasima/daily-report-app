"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
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

  const change = (k, v) => {
    setForm((prev) => ({ ...prev, v }));
  };

  // ✅ リアルタイム取得（IDも取る）
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
    await addDoc(collection(db, "reports"), {
      ...form
    });
    setForm({});
  };

  // ✅ 削除
