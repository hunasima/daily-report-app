import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522",
  storageBucket: "daily-report-27522.firebasestorage.app",
  messagingSenderId: "962362045585",
  appId: "1:9623..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);