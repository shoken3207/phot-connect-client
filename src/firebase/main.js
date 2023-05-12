import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_API_KEY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_API_KEY_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
// const analytics = getAnalytics(app);

export { auth, provider, storage, ref, uploadBytes, getDownloadURL };
