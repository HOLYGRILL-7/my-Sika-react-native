import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// @ts-ignore - getReactNativePersistence is standard for React Native but can have typing issues in some setups
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_ImORcvF4HobUXQ1JXSlrBCB-XGEe9d0",
  authDomain: "sika-7d3bd.firebaseapp.com",
  projectId: "sika-7d3bd",
  storageBucket: "sika-7d3bd.firebasestorage.app",
  messagingSenderId: "727369302653",
  appId: "1:727369302653:android:cf6946bebe40ff97d56714"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);

// Centralized Google Web Client ID (from google-services.json)
export const GOOGLE_WEB_CLIENT_ID = "727369302653-ubl79nu14aud8i0vrsapaoftlmgt82ts.apps.googleusercontent.com";