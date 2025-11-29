// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQiBVwoeCT1LtjEsrb5Xqure1jcqzXeWM",
  authDomain: "santos-56c07.firebaseapp.com",
  projectId: "santos-56c07",
  storageBucket: "santos-56c07.firebasestorage.app",
  messagingSenderId: "738576300856",
  appId: "1:738576300856:web:51b17f9e72398607c05fcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the app instance in case we need it elsewhere
export default app;