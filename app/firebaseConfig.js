import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_CONFIG",
  authDomain: "YOUR_FIREBASE_CONFIG",
  projectId: "YOUR_FIREBASE_CONFIG",
  storageBucket: "YOUR_FIREBASE_CONFIG",
  messagingSenderId: "YOUR_FIREBASE_CONFIG",
  appId: "YOUR_FIREBASE_CONFIG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export { collection, addDoc, getDocs, doc, updateDoc, onSnapshot };

