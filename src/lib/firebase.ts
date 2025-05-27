
// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVs8I73id-GPce_n1JEdm_S_gEAql3R30",
  authDomain: "project-hope-a64cd.firebaseapp.com",
  projectId: "project-hope-a64cd",
  storageBucket: "project-hope-a64cd.firebasestorage.app",
  messagingSenderId: "163623312354",
  appId: "1:163623312354:web:f146884fd37aff4b3337bb",
  measurementId: "G-HPEH29F66S"
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Error initializing Firebase app:", error);
  // Handle the error appropriately in a real app
  // For now, we'll rethrow or assign a default to prevent further issues during dev
  throw error; 
}

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app); // Initialize Firestore and assign to db

export { app, auth, googleProvider, db }; // Export db
