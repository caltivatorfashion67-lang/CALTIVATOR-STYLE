// ============================================================
// FIREBASE CONFIG
// Replace the values below with YOUR OWN config from:
// Firebase Console -> Project Settings -> Your apps -> Web app
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDedy4i-P9IMHjUoXa8VPmrdfjArkDmWmU",
  authDomain: "caltivator-9274.firebaseapp.com",
  projectId: "caltivator-9274",
  storageBucket: "caltivator-9274.firebasestorage.app",
  messagingSenderId: "73960308369",
  appId: "1:73960308369:web:ab48248cdad9501f440930"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);