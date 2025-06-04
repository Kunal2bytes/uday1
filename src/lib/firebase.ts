
// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUUkaOjeGdvdyjHqtjh6Ag-lNMItSNNOk",
  authDomain: "hope-f9012.firebaseapp.com",
  projectId: "hope-f9012",
  storageBucket: "hope-f9012.firebasestorage.app",
  messagingSenderId: "519928297012",
  appId: "1:519928297012:web:cf15cdecb3f0312980fc61",
  measurementId: "G-ZX4E542QEM"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;

try {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase services (Auth/Firestore):", error);
  // Handle cases where app might be initialized but services fail
  throw error;
}

export { app, auth, googleProvider, db };
