import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyBOIg-Yaj93XuVOVcLfXBI02SVyKkkGjv4',
  authDomain: 'photo-connect-aae70.firebaseapp.com',
  projectId: 'photo-connect-aae70',
  storageBucket: 'photo-connect-aae70.appspot.com',
  messagingSenderId: '687874139576',
  appId: '1:687874139576:web:ab40634f14875e1c731b4d',
  measurementId: 'G-HMSPM4P3MW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();
// const analytics = getAnalytics(app);

export { auth, provider, storage, ref, uploadBytes, getDownloadURL };
