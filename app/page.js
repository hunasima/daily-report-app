"use client";
import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFGeQvwzKWiqbn1-X7uo6aTjW1KLGSvK0",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setList(data);
    });
    return () => unsub();
  }, []);

  const add = async () => {
    if (!text) return;

