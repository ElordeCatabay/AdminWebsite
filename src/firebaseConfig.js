// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDa2YV_Gkd0FmZl6Ba-RzT_6MXl4VgWPR4",
  authDomain: "sari-sari-store-ee5a6.firebaseapp.com",
  projectId: "sari-sari-store-ee5a6",
  storageBucket: "sari-sari-store-ee5a6.appspot.com",
  messagingSenderId: "631953152475",
  appId: "1:631953152475:web:c32b5b136abcef4fb92ffe"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
