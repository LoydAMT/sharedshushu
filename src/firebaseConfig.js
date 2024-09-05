// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0oAEUK_qNEyAP4nDftZFcBIx2Yzw3I_Q",
  authDomain: "sharedocs-klc.firebaseapp.com",
  projectId: "sharedocs-klc",
  storageBucket: "sharedocs-klc.appspot.com",
  messagingSenderId: "95060184102",
  appId: "1:95060184102:web:895339200630f348bd2ae7",
  measurementId: "G-TEJL54DCHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { db };
