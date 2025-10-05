// services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaWvl88RKDaCnIa7-fuISXsgZ9we9pHus",
  authDomain: "way-78a05.firebaseapp.com",
  projectId: "way-78a05",
  storageBucket: "way-78a05.firebasestorage.app",
  messagingSenderId: "318124539347",
  appId: "1:318124539347:web:8bab007e689269b6338326",
  measurementId: "G-4956QKDXG2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Persistência automática!
const db = getFirestore(app);

export { auth, db };