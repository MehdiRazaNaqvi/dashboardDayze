import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDWBiER1Cy4LoD2CSavlct5dZYx2DnNPUg",
    authDomain: "dayze-1c404.firebaseapp.com",
    projectId: "dayze-1c404",
    storageBucket: "dayze-1c404.appspot.com",
    messagingSenderId: "708994009790",
    appId: "1:708994009790:web:4cb79e03674a138a006cef",
    measurementId: "G-K5GEYTMPEB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics };
