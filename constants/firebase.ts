import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_ImORcvF4HobUXQ1JXSlrBCB-XGEe9d0",
  authDomain: "sika-7d3bd.firebaseapp.com",
  projectId: "sika-7d3bd",
  storageBucket: "sika-7d3bd.firebasestorage.app",
  messagingSenderId: "727369302653",
  appId: "1:727369302653:android:cf6946bebe40ff97d56714"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);