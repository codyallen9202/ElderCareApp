import * as SecureStore from 'expo-secure-store';
import * as ExpoCrypto from 'expo-crypto'; // Use expo-crypto for generating random bytes
import {doc, setDoc, getDoc, collection, deleteDoc} from "firebase/firestore";
import { db } from "../firebaseconfig";

// Helper to convert Uint8Array to hex string
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))  // Use hex (16) instead of octal (8)
      .join("");
  }
  
export async function getUserId() {
    let userId = await SecureStore.getItemAsync('user_id');
    if (!userId) {
      const randomBytes = await ExpoCrypto.getRandomBytesAsync(12);  // Using expo-crypto for random bytes
      userId = bytesToHex(randomBytes);
      await SecureStore.setItemAsync('user_id', userId);
    }
  return userId;
}

export async function InitializeFirestoreUser(userID: string) {
  const userDocRef = doc(db, "Users", userID);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
  
    try {
        await setDoc(doc(db, "Users", userID), {
        timestamp: Date.now()
        });
        alert('User added!');
    
    } catch (error) {
        console.error("Error creating user in Firestore:", error);
    }
  }
}


export async function saveInfo(infoArr : any,  userId : string, collection : string) {
    const dateid = infoArr.id;
    const addInfoRef = doc(db, 'Users', userId, collection, dateid);
    const {id, ...infoToSave} = infoArr;
    try{
        await setDoc(addInfoRef, infoToSave);
    } catch(error) {
        console.error("Error Message: " + error);
    }
}

export async function deleteCaretaker(dateid : string, userId : string) {
    try{
        const caretakerDoc = doc(db, "Users", userId, "Caretakers", dateid);
        await deleteDoc(caretakerDoc);
    } catch(error) {
        console.error("Error Message: " + error);
    }
}
