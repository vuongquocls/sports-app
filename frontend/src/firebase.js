import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "sports-app-mu-2026",
  appId: "1:935753443235:web:1ed918302038847a9d9c16",
  storageBucket: "sports-app-mu-2026.firebasestorage.app",
  apiKey: "AIzaSyBPuw1ikZXNO07zjzIa7qv0hdCECw65zGw",
  authDomain: "sports-app-mu-2026.firebaseapp.com",
  messagingSenderId: "935753443235",
  projectNumber: "935753443235",
  version: "2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
