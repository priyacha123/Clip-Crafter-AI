// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "intense-howl-472504-b2.firebaseapp.com",
  projectId: "intense-howl-472504-b2",
  storageBucket: "intense-howl-472504-b2.firebasestorage.app",
  messagingSenderId: "521155202175",
  appId: "1:521155202175:web:80d61ceb0684849e7d434a",
  measurementId: "G-RD6H2D0BZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
