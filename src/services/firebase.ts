// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; 

const firebaseConfig = {
  apiKey: "AIzaSyBM_8rW4kdxwiDRyVbG2EvyLo5UpMHwckY",
  authDomain: "XXX",
  projectId: "cmp2004project-e09ec",
  storageBucket: "cmp2004project-e09ec.firebasestorage.app",
  messagingSenderId: "118556580045",
  appId: "1:118556580045:android:b67b12baa42388105af184"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);