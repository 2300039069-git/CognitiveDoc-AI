import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzERLdZc5VGCiXveCK5ZXIJnDmKXbpR8Y",
  authDomain: "cognitivedoc-ai.firebaseapp.com",
  projectId: "cognitivedoc-ai",
  storageBucket: "cognitivedoc-ai.firebasestorage.app",
  messagingSenderId: "752806709408",
  appId: "1:752806709408:web:f881e45898370dee7ae1c5",
  measurementId: "G-2PS614QJZL"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup
};

export default app;
