
// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVs8l73id-GPce_n1JEdm_S_gEAql3R30",
  authDomain: "project-hope-a64cd.firebaseapp.com",
  projectId: "project-hope-a64cd",
  storageBucket: "project-hope-a64cd.appspot.com",
  messagingSenderId: "163623312354",
  appId: "YOUR_APP_ID" // Make sure to replace this with your actual App ID from Firebase Console
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app); // Initialize Firestore and assign to db

export { app, auth, googleProvider, db }; // Export db
