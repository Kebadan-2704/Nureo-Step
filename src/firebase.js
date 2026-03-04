import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDO5RvJbcK03b4Ucaz3H-cvUJdAM0jqezU",
    authDomain: "neurostep-d061d.firebaseapp.com",
    databaseURL: "https://neurostep-d061d-default-rtdb.firebaseio.com",
    projectId: "neurostep-d061d",
    storageBucket: "neurostep-d061d.firebasestorage.app",
    messagingSenderId: "709963792711",
    appId: "1:709963792711:web:2ec84ff6ede70a9f020c62"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Authenticate anonymously so we can read/write data
signInAnonymously(auth).catch(error => {
    console.error("Firebase Anonymous Auth failed:", error);
});
