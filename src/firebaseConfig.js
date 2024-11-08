// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxoNvZ38bbEMIJAZGrqGzO7T1tEw8dlME",
  authDomain: "test-e2eb4.firebaseapp.com",
  databaseURL: "https://test-e2eb4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-e2eb4",
  storageBucket: "test-e2eb4.firebasestorage.app",
  messagingSenderId: "78120037245",
  appId: "1:78120037245:web:53a7252523ac666d7d7a14",
  measurementId: "G-667EH5X5WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);  // Optional: Only if you want to use Analytics
export const database = getDatabase(app);  // Export the initialized database
