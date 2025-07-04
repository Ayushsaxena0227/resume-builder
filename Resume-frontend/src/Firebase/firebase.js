// src/Firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA7vb_lZ-k5-BzS6cnd3xdn_EDycHhwW9I",
  authDomain: "resume-builder-fdabc.firebaseapp.com",
  projectId: "resume-builder-fdabc",
  storageBucket: "resume-builder-fdabc.firebasestorage.app",
  messagingSenderId: "739290811864",
  appId: "1:739290811864:web:179b7c25bb71e0b74836ad",
  measurementId: "G-2F8TYSSQKY",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
