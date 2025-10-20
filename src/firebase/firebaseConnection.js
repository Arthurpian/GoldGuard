import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEC7VTFTU8fJzAe1sOgh2x8vms_2LvNKY",
  authDomain: "goldguard-e2e41.firebaseapp.com",
  projectId: "goldguard-e2e41",
  storageBucket: "goldguard-e2e41.firebasestorage.app",
  messagingSenderId: "296301850657",
  appId: "1:296301850657:web:77bef984b44a4d3b3db360",
  measurementId: "G-3JR2N6JCVP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth };