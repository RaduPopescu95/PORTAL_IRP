import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { storage, authentication, database, db };
