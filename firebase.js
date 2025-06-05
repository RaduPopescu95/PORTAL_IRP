import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork, disableNetwork, clearIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRBTW2_E88mKdOYGjI4OTHhHE1xaHq3rw",
  authDomain: "db-isudeansul.firebaseapp.com",
  projectId: "db-isudeansul",
  storageBucket: "db-isudeansul.appspot.com",
  messagingSenderId: "1013015567056",
  appId: "1:1013015567056:web:0a31a3b0b1d4e0ab8ed3cd",
  measurementId: "G-VN6T6XFXQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const authentication = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Client-side only: Configure Firestore for fresh data
if (typeof window !== 'undefined') {
  console.log('Configuring Firestore for fresh data...');
  
  // Clear only persistent cache, don't terminate the client
  try {
    // Clear IndexedDB persistence if it exists
    clearIndexedDbPersistence(db).catch((error) => {
      console.log('No IndexedDB persistence to clear:', error.message);
    });
    
    console.log('Firestore configured for fresh data');
  } catch (error) {
    console.log('Firestore cache configuration (expected):', error.message);
  }
  
  // Clear only Firebase-related browser caches, not all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('firebase') || name.includes('firestore')) {
          caches.delete(name);
          console.log('Cleared Firebase cache:', name);
        }
      });
    });
  }
  
  // Clear only Firebase-related localStorage
  try {
    const firebaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('firebase') || key.includes('firestore')
    );
    firebaseKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('Cleared Firebase localStorage:', key);
    });
  } catch (e) {
    console.log('LocalStorage access error:', e.message);
  }
}

// Force all requests to use server data
export const FORCE_SERVER_OPTIONS = {
  source: 'server'
};

export default app;
