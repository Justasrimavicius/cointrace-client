// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAtbLN49_BNNfrcd7kwEeOK805L9YKTDs",
  authDomain: "cointrace-a8f00.firebaseapp.com",
  projectId: "cointrace-a8f00",
  storageBucket: "cointrace-a8f00.appspot.com",
  messagingSenderId: "57459715468",
  appId: "1:57459715468:web:75782a8dc96d3cff0afaa9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);