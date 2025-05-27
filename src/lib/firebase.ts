// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // Import getFirestore

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your API Key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your Auth Domain
  projectId: "YOUR_PROJECT_ID", // Replace with your Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Messaging Sender ID
  appId: "YOUR_APP_ID" // Replace with your App ID
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app); // Initialize Firestore and assign to db

export { app, auth, googleProvider, db }; // Export db
