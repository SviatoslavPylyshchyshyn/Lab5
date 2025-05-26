import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBexI_OMBQiG25hWecLbLgj_m-7W5T0zeI",
  authDomain: "lab-4-924b3.firebaseapp.com",
  projectId: "lab-4-924b3",
  storageBucket: "lab-4-924b3.appspot.com",
  messagingSenderId: "789007215932",
  appId: "1:789007215932:web:b0387b019585b7f791c239",
  measurementId: "G-P6XLNXYGY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable Facebook authentication
const facebookProvider = new FacebookAuthProvider();

// Export initialized services
export { auth, db, storage, facebookProvider };