// Firebase initialization and exports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Use Vite env vars when available, fallback to the inline config provided.
// For production it's recommended to set VITE_FIREBASE_* env vars instead of
// committing credentials directly.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKC9bISEPekYOMxaIte9RkJtsEmaRozNM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tradestreet-claude.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tradestreet-claude",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tradestreet-claude.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "898234682878",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:898234682878:web:a0283383d9f7c9bef204af",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-97H9RZPFM0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics can fail in non-browser contexts; guard it.
let analytics: ReturnType<typeof getAnalytics> | undefined;
try {
  analytics = getAnalytics(app);
} catch (e) {
  analytics = undefined;
}

export { app, auth, analytics, firebaseConfig };
