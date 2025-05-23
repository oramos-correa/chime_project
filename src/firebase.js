import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBeH8RZBAXR4MLzIhfOD3wIpvN7MhyP6Uc",
    authDomain: "chimemini.firebaseapp.com",
    projectId: "chimemini",
    storageBucket: "chimemini.firebasestorage.app",
    messagingSenderId: "8228200232",
    appId: "1:8228200232:web:341867a4c58f13abf07a1d"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };