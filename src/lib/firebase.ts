
// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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
  console.log("Attempting to initialize Firebase with config:", firebaseConfig);
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully:", app.name);
} catch (error) {
  console.error("Critical error initializing Firebase app:", error);
  // In a real app, you might want to display a more user-friendly error message
  // or prevent the app from proceeding if Firebase is essential.
  throw error; 
}

let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;

try {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  console.log("Firebase Auth and Firestore services initialized.");
} catch (error) {
  console.error("Error initializing Firebase services (Auth/Firestore):", error);
  // Handle cases where app might be initialized but services fail
  throw error;
}

export { app, auth, googleProvider, db };
