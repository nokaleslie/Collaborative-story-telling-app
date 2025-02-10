// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6mMrVBysuceRK0fBNFgEckN9L-39J7t8",
  authDomain: "collaborative-storytelling-app.firebaseapp.com",
  projectId: "collaborative-storytelling-app",
  storageBucket: "collaborative-storytelling-app.firebasestorage.app",
  messagingSenderId: "469749173479",
  appId: "1:469749173479:web:8677935d6f577e24d9e642",
  measurementId: "G-0HH2N4RF0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);