import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your actual configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaqIuhmlMh9TVpDMiviPVJEp4chjcQAYU",
  authDomain: "impacthub-3ef38.firebaseapp.com",
  projectId: "impacthub-3ef38",
  storageBucket: "impacthub-3ef38.firebasestorage.app",
  messagingSenderId: "154981802479",
  appId: "1:154981802479:web:90a14aac542b11d0d1561a",
  measurementId: "G-Q9CCZT398W"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Optional, but good to have since you included it)
const analytics = getAnalytics(app);

// Initialize Authentication & Google Provider
// These exports are REQUIRED for your Login/Register pages to work
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();