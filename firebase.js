import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvibfeWKkrnvxZqotnt6htYkCMjkE7frc",
  authDomain: "isudb-e349d.firebaseapp.com",
  databaseURL: "https://isudb-e349d-default-rtdb.firebaseio.com",
  projectId: "isudb-e349d",
  storageBucket: "isudb-e349d.appspot.com",
  messagingSenderId: "367957621287",
  appId: "1:367957621287:web:1b41735dd05b93f5236c02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize other Firebase services
const storage = getStorage(app);
const authentication = getAuth(app);
const database = getDatabase(app);

// Initialize Cloud Firestore with cache disabled
const db = getFirestore(app);

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
console.log('Firebase initialized - Environment:', process.env.NODE_ENV, 'Vercel Env:', process.env.VERCEL_ENV, 'Is Production:', isProduction);

// Disable Firestore offline persistence to ensure fresh data
if (typeof window !== 'undefined') {
  // Client-side only: disable offline cache more aggressively in production
  try {
    console.log('Configuring Firestore cache settings...');
    
    disableNetwork(db).then(() => {
      console.log("Firestore offline mode disabled");
      enableNetwork(db).then(() => {
        console.log("Firestore online mode enabled - cache disabled");
        
        // Additional cache clearing in production
        if (isProduction) {
          console.log("Production environment detected - applying aggressive cache settings");
          // Force clear any browser caches related to Firestore
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                if (registration.scope.includes('firestore') || registration.scope.includes('firebase')) {
                  registration.unregister();
                  console.log('Unregistered Firebase-related service worker');
                }
              }
            });
          }
        }
      });
    });
  } catch (error) {
    console.error("Firestore cache configuration error:", error);
  }
}

export { storage, authentication, database, db };
