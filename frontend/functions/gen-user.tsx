import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-crypto';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "./firebaseConfig"; // Your Firebase setup

// Create UserID
async function getUserId() {
    let userId = await SecureStore.getItemAsync('user_id');
    if (!userId) {
        userId = Random.getRandomBytes(16).toString();
        await SecureStore.setItemAsync('user_id', userId);
    }
    return userId;
}


// Store UserID to Firebase
const db = getFirestore(app);

async function saveUserToFirebase() {
    const userId = await getUserId();
    const userRef = doc(db, "users", userId);

    await setDoc(userRef, { createdAt: new Date().toISOString() }, { merge: true });
}


// Retrieving data from Firebase
async function fetchUserData() {
    const userId = await getUserId();
    const userRef = doc(getFirestore(), "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        console.error("No user data found!");
        return null;
    }
}
