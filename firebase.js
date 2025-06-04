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

// Disable Firestore offline persistence to ensure fresh data
if (typeof window !== 'undefined') {
  // Client-side only: disable offline cache
  try {
    disableNetwork(db).then(() => {
      console.log("Firestore offline mode disabled");
      enableNetwork(db).then(() => {
        console.log("Firestore online mode enabled - cache disabled");
      });
    });
  } catch (error) {
    console.log("Firestore cache configuration:", error);
  }
}

export { storage, authentication, database, db };
