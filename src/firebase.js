import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAZp_0Mx_kzTkjHI-UlTQADwbc_bZObCc",
  authDomain: "blood-donation-d4483.firebaseapp.com",
  projectId: "blood-donation-d4483",
  storageBucket: "blood-donation-d4483.firebasestorage.app",
  messagingSenderId: "160141409629",
  appId: "1:160141409629:web:036b810f306a0934fabcb4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);