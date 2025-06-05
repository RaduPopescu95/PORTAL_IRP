import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork, clearIndexedDbPersistence, terminate } from "firebase/firestore";
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

// Initialize Cloud Firestore with NO CACHE and force server data ALWAYS
export const db = getFirestore(app);

// Client-side only: COMPLETELY disable all caching mechanisms
if (typeof window !== 'undefined') {
  console.log('Disabling ALL Firestore caching mechanisms...');
  
  // Try to clear any existing cache
  try {
    // Terminate any existing connections
    terminate(db).catch(() => {
      console.log('No existing Firestore connection to terminate');
    });
    
    // Clear IndexedDB persistence if it exists
    clearIndexedDbPersistence(db).catch((error) => {
      console.log('No IndexedDB persistence to clear or error clearing:', error);
    });
    
    // Disable network and re-enable to force fresh connections
    disableNetwork(db).then(() => {
      console.log('Firestore network disabled');
      return enableNetwork(db);
    }).then(() => {
      console.log('Firestore network re-enabled with fresh connection');
    }).catch((error) => {
      console.log('Network toggle error (expected):', error);
    });
    
  } catch (error) {
    console.log('Cache clearing operations (expected some to fail):', error);
  }
  
  // Force browser to clear Firebase caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('firebase') || name.includes('firestore')) {
          caches.delete(name);
          console.log('Deleted Firebase cache:', name);
        }
      });
    });
  }
  
  // Clear localStorage related to Firebase
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('firestore') || key.includes('google')) {
        localStorage.removeItem(key);
        console.log('Cleared localStorage key:', key);
      }
    });
  } catch (e) {
    console.log('LocalStorage clearing error:', e);
  }
}

// Force all requests to use server data with aggressive bypass
export const FORCE_SERVER_OPTIONS = {
  source: 'server'
};

export default app;
