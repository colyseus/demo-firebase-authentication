// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMkKUsvM14ctkHUemX3A_h8EBEFPkGII4",
  authDomain: "colyseus-demo.firebaseapp.com",
  projectId: "colyseus-demo",
  storageBucket: "colyseus-demo.appspot.com",
  messagingSenderId: "531867792293",
  appId: "1:531867792293:web:667cc62bedf9a6ad3a2e4c",
  measurementId: "G-MFQ7GPD146"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);