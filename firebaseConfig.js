import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_96iKu5Jr0tGXggpy3cLBZrwut2vwzBc",
  authDomain: "lifeplannerapp-4055e.firebaseapp.com",
  projectId: "lifeplannerapp-4055e",
  storageBucket: "lifeplannerapp-4055e.firebasestorage.app",
  messagingSenderId: "686192717694",
  appId: "1:686192717694:web:379af26b21e8548c86cd2f",
  measurementId: "G-6N08CESPYJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);