// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh094LLtNVwFc99PaxxSF0fiVr50dSYb4",
  authDomain: "laundry-system-408d8.firebaseapp.com",
  projectId: "laundry-system-408d8",
  storageBucket: "laundry-system-408d8.appspot.com",
  messagingSenderId: "977356523224",
  appId: "1:977356523224:web:a72b0e49a12f4089e9f9ad",
  measurementId: "G-G3JKM2V1P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage()